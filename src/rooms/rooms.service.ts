import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Amenities } from './entities/amenities.entity';
import { RoomsStatus } from './entities/room-status.entity';
import { RoomsType } from './entities/room-type.entity';
import { Rooms } from './entities/room.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Rooms)
        private readonly roomsRepository: Repository<Rooms>,
        @InjectRepository(RoomsType)
        private readonly roomsTypeRepository: Repository<RoomsType>,
        @InjectRepository(RoomsStatus)
        private readonly roomsStatusRepository: Repository<RoomsStatus>,
        @InjectRepository(Amenities)
        private readonly amenitiesRepository: Repository<Amenities>,
    ) {}

    // ======================== НОМЕРА ========================

    async findAll() {
        // Гостевой — скрытые не показываем
        return this.roomsRepository.find({
            relations: {
                roomsType: true,
                roomsStatus: true,
                amenities: true,
            },
        });
    }

    async findAllAdmin() {
        // Админский — видим все, включая удалённые
        return this.roomsRepository.find({
            relations: {
                roomsType: true,
                roomsStatus: true,
                amenities: true,
            },
            withDeleted: true,
        });
    }

    async findById(id: string) {
        // Гостевой
        const room = await this.roomsRepository.findOne({
            where: { id },
            relations: {
                roomsType: true,
                roomsStatus: true,
                amenities: true,
            },
        });

        if (!room) {
            throw new NotFoundException('Номер не найден');
        }

        return room;
    }

    async findByIdWithDeleted(id: string) {
        // Админский
        const room = await this.roomsRepository.findOne({
            where: { id },
            relations: {
                roomsType: true,
                roomsStatus: true,
                amenities: true,
            },
            withDeleted: true,
        });

        if (!room) {
            throw new NotFoundException('Номер не найден');
        }

        return room;
    }

    async create(dto: CreateRoomDto) {
        const existRoom = await this.roomsRepository.findOne({
            where: { roomNumber: dto.roomNumber },
        });
        if (existRoom)
            throw new HttpException(
                `room with number ${dto.roomNumber} already exist`,
                HttpStatus.BAD_REQUEST,
            );

        const roomsType = await this.roomsTypeRepository.findOne({
            where: { id: dto.roomsTypeId },
        });

        if (!roomsType) {
            throw new NotFoundException('Тип номера не найден');
        }

        const roomsStatus = await this.roomsStatusRepository.findOne({
            where: { id: dto.roomsStatusId },
        });

        if (!roomsStatus) {
            throw new NotFoundException('Статус номера не найден');
        }

        let amenities: Amenities[] = [];

        if (dto.amenityIds && dto.amenityIds.length > 0) {
            amenities = await this.amenitiesRepository.findBy({
                id: In(dto.amenityIds),
            });
        }

        const room = this.roomsRepository.create({
            roomNumber: dto.roomNumber,
            roomsType,
            roomsStatus,
            pricePerNight: dto.pricePerNight,
            floor: dto.floor,
            capacity: dto.capacity,
            bedsCount: dto.bedsCount,
            description: dto.description,
            amenities,
            photos: dto.photos,
        });

        return this.roomsRepository.save(room);
    }

    async update(dto: UpdateRoomDto) {
        const room = await this.findByIdWithDeleted(dto.id);

        if (dto.roomsTypeId) {
            const roomsType = await this.roomsTypeRepository.findOne({
                where: { id: dto.roomsTypeId },
            });

            if (!roomsType) {
                throw new NotFoundException('Тип номера не найден');
            }

            room.roomsType = roomsType;
        }

        if (dto.roomsStatusId) {
            const roomsStatus = await this.roomsStatusRepository.findOne({
                where: { id: dto.roomsStatusId },
            });

            if (!roomsStatus) {
                throw new NotFoundException('Статус номера не найден');
            }

            room.roomsStatus = roomsStatus;
        }

        if (dto.amenityIds) {
            const amenities = await this.amenitiesRepository.findBy({
                id: In(dto.amenityIds),
            });
            room.amenities = amenities;
        }

        if (dto.roomNumber !== undefined) room.roomNumber = dto.roomNumber;
        if (dto.pricePerNight !== undefined)
            room.pricePerNight = dto.pricePerNight;
        if (dto.floor !== undefined) room.floor = dto.floor;
        if (dto.capacity !== undefined) room.capacity = dto.capacity;
        if (dto.bedsCount !== undefined) room.bedsCount = dto.bedsCount;
        if (dto.description !== undefined) room.description = dto.description;
        if (dto.photos !== undefined) room.photos = dto.photos;

        return this.roomsRepository.save(room);
    }

    async softDelete(id: string) {
        const room = await this.findByIdWithDeleted(id);
        await this.roomsRepository.softRemove(room);
        return { message: 'Номер удалён' };
    }

    async restore(id: string) {
        const room = await this.roomsRepository.findOne({
            where: { id },
            relations: {
                roomsType: true,
                roomsStatus: true,
                amenities: true,
            },
            withDeleted: true,
        });

        if (!room) {
            throw new NotFoundException('Номер не найден');
        }

        if (!room.deleted_at) {
            throw new BadRequestException('Номер не был удалён');
        }

        await this.roomsRepository.recover(room);
        return this.findById(id);
    }

    // ================== ФУНКЦИИ СМЕНЫ СТАТУСА ==================

    async setRoomOccupied(id: string) {
        const room = await this.findByIdWithDeleted(id);

        if (room.roomsStatus.id === 3) {
            return room;
        }

        const occupiedStatus = await this.roomsStatusRepository.findOne({
            where: { id: 2 },
        });

        if (!occupiedStatus) {
            throw new NotFoundException('Статус "Занят" не найден');
        }

        room.roomsStatus = occupiedStatus;
        return this.roomsRepository.save(room);
    }

    async setRoomAvailable(id: string) {
        const room = await this.findByIdWithDeleted(id);

        const availableStatus = await this.roomsStatusRepository.findOne({
            where: { id: 1 },
        });

        if (!availableStatus) {
            throw new NotFoundException('Статус "Доступен" не найден');
        }

        room.roomsStatus = availableStatus;
        return this.roomsRepository.save(room);
    }

    async setRoomMaintenance(id: string) {
        const room = await this.findByIdWithDeleted(id);

        const maintenanceStatus = await this.roomsStatusRepository.findOne({
            where: { id: 3 },
        });

        if (!maintenanceStatus) {
            throw new NotFoundException('Статус "На обслуживании" не найден');
        }

        room.roomsStatus = maintenanceStatus;
        return this.roomsRepository.save(room);
    }

    // ======================== СВЯЗИ ========================

    async getAllRelations() {
        const amenities = await this.amenitiesRepository.find();
        const types = await this.roomsTypeRepository.find();
        const statuses = await this.roomsStatusRepository.find();

        return { amenities, types, statuses };
    }

    // ======================== УДОБСТВА ========================

    async createAmenity(dto: CreateAmenityDto) {
        const amenity = this.amenitiesRepository.create(dto);
        return this.amenitiesRepository.save(amenity);
    }

    async updateAmenity(dto: UpdateAmenityDto) {
        const amenity = await this.amenitiesRepository.findOne({
            where: { id: dto.id },
        });

        if (!amenity) {
            throw new NotFoundException('Удобство не найдено');
        }

        if (dto.name !== undefined) amenity.name = dto.name;
        if (dto.description !== undefined)
            amenity.description = dto.description;

        return this.amenitiesRepository.save(amenity);
    }

    async deleteAmenity(id: number) {
        const amenity = await this.amenitiesRepository.findOne({
            where: { id },
        });

        if (!amenity) {
            throw new NotFoundException('Удобство не найдено');
        }

        await this.amenitiesRepository.remove(amenity);
        return { message: 'Удобство удалено' };
    }
}
