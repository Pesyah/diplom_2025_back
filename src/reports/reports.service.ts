import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationStatus } from 'src/reservations/entities/reservation-status.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { In, Repository } from 'typeorm';
import { RoomsReportQueryDto } from './dto/rooms-report-query.dto';

interface ReportRoom {
    id: string;
    roomNumber: string;
    roomsType: string | null;
}

export interface ReportReservation {
    id: string;
    roomId: string;
    roomNumber: string;
    guestName: string;
    statusId: number;
    statusName: string;
    checkInDate: string;
    checkOutDate: string;
    periodStartDate: string;
    periodEndDate: string;
    nightsInPeriod: number;
    totalNights: number;
    revenueInPeriod: number;
    totalPrice: number;
}

export interface ReportGroup {
    key: string;
    label: string;
    reservationsCount: number;
    nights: number;
    revenue: number;
    averageDailyRate: number;
}

interface DateRange {
    from: Date | null;
    to: Date | null;
}

export interface ReportStatus {
    id: number;
    name: string;
}

export interface RoomsReport {
    filters: {
        roomIds: string[];
        statusIds: number[];
        dateFrom: string | null;
        dateTo: string | null;
    };
    availableStatuses: ReportStatus[];
    summary: {
        roomsCount: number;
        reservationsCount: number;
        nights: number;
        revenue: number;
        averageDailyRate: number;
    };
    byRooms: ReportGroup[];
    byMonths: ReportGroup[];
    reservations: ReportReservation[];
}

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const CANCELLED_STATUS_ID = 5;

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(Rooms)
        private readonly roomsRepository: Repository<Rooms>,
        @InjectRepository(ReservationStatus)
        private readonly reservationStatusRepository: Repository<ReservationStatus>,
    ) {}

    async getRoomsReport(query: RoomsReportQueryDto): Promise<RoomsReport> {
        const dateRange = this.normalizeDateRange(query.dateFrom, query.dateTo);
        const selectedRooms = await this.getSelectedRooms(query.roomIds);
        const availableStatuses = await this.getAvailableStatuses();
        const selectedStatusIds = this.getSelectedStatusIds(
            availableStatuses,
            query.statusIds,
        );
        const reservations = await this.getReservations(
            selectedRooms,
            dateRange,
            selectedStatusIds,
        );

        const reportReservations = reservations
            .map((reservation) => this.toReportReservation(reservation, dateRange))
            .filter((reservation) => reservation.nightsInPeriod > 0);

        const byRooms = this.buildRoomGroups(selectedRooms, reportReservations);
        const byMonths = this.buildMonthGroups(reportReservations);
        const summary = this.buildSummary(reportReservations, selectedRooms.length);

        return {
            filters: {
                roomIds: query.roomIds ?? [],
                statusIds: selectedStatusIds,
                dateFrom: dateRange.from ? this.toDateString(dateRange.from) : null,
                dateTo: dateRange.to ? this.toDateString(this.addDays(dateRange.to, -1)) : null,
            },
            availableStatuses,
            summary,
            byRooms,
            byMonths,
            reservations: reportReservations,
        };
    }

    private async getSelectedRooms(roomIds?: string[]): Promise<ReportRoom[]> {
        const rooms = await this.roomsRepository.find({
            where: roomIds?.length ? { id: In(roomIds) } : {},
            relations: { roomsType: true },
            withDeleted: true,
        });

        if (roomIds?.length && rooms.length !== roomIds.length) {
            throw new BadRequestException('One or more rooms were not found');
        }

        return rooms
            .map((room) => ({
                id: room.id,
                roomNumber: room.roomNumber,
                roomsType: room.roomsType?.name ?? null,
            }))
            .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, 'ru'));
    }

    private async getAvailableStatuses(): Promise<ReportStatus[]> {
        const statuses = await this.reservationStatusRepository.find({
            order: { id: 'ASC' },
        });

        return statuses.map((status) => ({
            id: status.id,
            name: status.name,
        }));
    }

    private getSelectedStatusIds(
        availableStatuses: ReportStatus[],
        statusIds?: number[],
    ): number[] {
        const availableStatusIds = availableStatuses.map((status) => status.id);

        if (!statusIds?.length) {
            return availableStatusIds.filter((id) => id !== CANCELLED_STATUS_ID);
        }

        const uniqueStatusIds = Array.from(new Set(statusIds));
        const unknownStatusIds = uniqueStatusIds.filter(
            (id) => !availableStatusIds.includes(id),
        );

        if (unknownStatusIds.length > 0) {
            throw new BadRequestException('One or more reservation statuses were not found');
        }

        return uniqueStatusIds;
    }

    private async getReservations(
        selectedRooms: ReportRoom[],
        dateRange: DateRange,
        statusIds: number[],
    ): Promise<Reservation[]> {
        if (selectedRooms.length === 0 || statusIds.length === 0) {
            return [];
        }

        const query = this.reservationRepository
            .createQueryBuilder('reservation')
            .withDeleted()
            .leftJoinAndSelect('reservation.room', 'room')
            .leftJoinAndSelect('room.roomsType', 'roomsType')
            .leftJoinAndSelect('reservation.reservationStatus', 'reservationStatus')
            .leftJoinAndSelect('reservation.mainGuest', 'mainGuest')
            .where('reservation.reservationStatusId IN (:...statusIds)', {
                statusIds,
            })
            .andWhere('reservation.roomId IN (:...roomIds)', {
                roomIds: selectedRooms.map((room) => room.id),
            });

        if (dateRange.from) {
            query.andWhere('reservation.checkOutDate > :dateFrom', {
                dateFrom: dateRange.from,
            });
        }

        if (dateRange.to) {
            query.andWhere('reservation.checkInDate < :dateTo', {
                dateTo: dateRange.to,
            });
        }

        return query
            .orderBy('reservation.checkInDate', 'ASC')
            .addOrderBy('room.roomNumber', 'ASC')
            .getMany();
    }

    private normalizeDateRange(dateFrom?: string, dateTo?: string): DateRange {
        let from = dateFrom ? this.parseDateStart(dateFrom) : null;
        let to = dateTo ? this.addDays(this.parseDateStart(dateTo), 1) : null;

        if (from && to && from > to) {
            const previousFrom = from;
            from = this.addDays(to, -1);
            to = this.addDays(previousFrom, 1);
        }

        return { from, to };
    }

    private toReportReservation(
        reservation: Reservation,
        dateRange: DateRange,
    ): ReportReservation {
        const checkIn = this.parseDateStart(reservation.checkInDate);
        const checkOut = this.parseDateStart(reservation.checkOutDate);
        const periodStart = dateRange.from && dateRange.from > checkIn ? dateRange.from : checkIn;
        const periodEnd = dateRange.to && dateRange.to < checkOut ? dateRange.to : checkOut;
        const totalNights = this.getNights(checkIn, checkOut);
        const nightsInPeriod = this.getNights(periodStart, periodEnd);
        const totalPrice = Number(reservation.totalPrice);
        const revenueInPeriod =
            totalNights > 0 ? this.roundMoney((totalPrice / totalNights) * nightsInPeriod) : 0;

        return {
            id: reservation.id,
            roomId: reservation.room.id,
            roomNumber: reservation.room.roomNumber,
            guestName: `${reservation.mainGuest?.surname ?? ''} ${
                reservation.mainGuest?.name ?? ''
            }`.trim(),
            statusId: reservation.reservationStatus.id,
            statusName: reservation.reservationStatus.name,
            checkInDate: this.toDateString(checkIn),
            checkOutDate: this.toDateString(checkOut),
            periodStartDate: this.toDateString(periodStart),
            periodEndDate: this.toDateString(periodEnd),
            nightsInPeriod,
            totalNights,
            revenueInPeriod,
            totalPrice,
        };
    }

    private buildSummary(reservations: ReportReservation[], roomsCount: number) {
        const reservationsCount = reservations.length;
        const nights = reservations.reduce((sum, reservation) => sum + reservation.nightsInPeriod, 0);
        const revenue = this.roundMoney(
            reservations.reduce((sum, reservation) => sum + reservation.revenueInPeriod, 0),
        );

        return {
            roomsCount,
            reservationsCount,
            nights,
            revenue,
            averageDailyRate: nights > 0 ? this.roundMoney(revenue / nights) : 0,
        };
    }

    private buildRoomGroups(
        rooms: ReportRoom[],
        reservations: ReportReservation[],
    ): ReportGroup[] {
        return rooms.map((room) => {
            const roomReservations = reservations.filter((reservation) => reservation.roomId === room.id);
            const group = this.buildGroup(room.id, `Room ${room.roomNumber}`, roomReservations);
            return {
                ...group,
                label: room.roomsType ? `${room.roomNumber} (${room.roomsType})` : room.roomNumber,
            };
        });
    }

    private buildMonthGroups(reservations: ReportReservation[]): ReportGroup[] {
        const groups = new Map<string, ReportReservation[]>();

        for (const reservation of reservations) {
            const periodStart = this.parseDateStart(reservation.periodStartDate);
            const periodEnd = this.parseDateStart(reservation.periodEndDate);
            let current = this.getMonthStart(periodStart);

            while (current < periodEnd) {
                const monthEnd = this.addMonths(current, 1);
                const monthReservation = {
                    ...reservation,
                    nightsInPeriod: this.getNights(
                        current > periodStart ? current : periodStart,
                        monthEnd < periodEnd ? monthEnd : periodEnd,
                    ),
                };

                if (monthReservation.nightsInPeriod > 0) {
                    const totalNights = reservation.totalNights;
                    monthReservation.revenueInPeriod =
                        totalNights > 0
                            ? this.roundMoney(
                                  (reservation.totalPrice / totalNights) *
                                      monthReservation.nightsInPeriod,
                              )
                            : 0;
                    const key = this.toMonthKey(current);
                    groups.set(key, [...(groups.get(key) ?? []), monthReservation]);
                }

                current = monthEnd;
            }
        }

        return Array.from(groups.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, monthReservations]) =>
                this.buildGroup(key, this.formatMonthLabel(key), monthReservations),
            );
    }

    private buildGroup(
        key: string,
        label: string,
        reservations: ReportReservation[],
    ): ReportGroup {
        const reservationsCount = reservations.length;
        const nights = reservations.reduce((sum, reservation) => sum + reservation.nightsInPeriod, 0);
        const revenue = this.roundMoney(
            reservations.reduce((sum, reservation) => sum + reservation.revenueInPeriod, 0),
        );

        return {
            key,
            label,
            reservationsCount,
            nights,
            revenue,
            averageDailyRate: nights > 0 ? this.roundMoney(revenue / nights) : 0,
        };
    }

    private parseDateStart(value: string | Date): Date {
        if (typeof value === 'string') {
            const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                const [, year, month, day] = match;
                return new Date(
                    Date.UTC(Number(year), Number(month) - 1, Number(day)),
                );
            }
        }

        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date');
        }
        return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );
    }

    private getNights(from: Date, to: Date): number {
        return Math.max(0, Math.round((to.getTime() - from.getTime()) / MS_IN_DAY));
    }

    private addDays(date: Date, days: number): Date {
        const next = new Date(date);
        next.setUTCDate(next.getUTCDate() + days);
        return next;
    }

    private addMonths(date: Date, months: number): Date {
        const next = new Date(date);
        next.setUTCMonth(next.getUTCMonth() + months);
        return next;
    }

    private getMonthStart(date: Date): Date {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    }

    private toMonthKey(date: Date): string {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    }

    private formatMonthLabel(key: string): string {
        const [year, month] = key.split('-').map(Number);
        return new Intl.DateTimeFormat('ru-RU', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
        }).format(new Date(Date.UTC(year, month - 1, 1)));
    }

    private toDateString(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    private roundMoney(value: number): number {
        return Math.round(value * 100) / 100;
    }
}
