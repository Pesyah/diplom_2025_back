import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { ReportGroup, ReportReservation, RoomsReport } from './reports.service';

interface PdfGroupRow extends ReportGroup {
    revenueFormatted: string;
    averageDailyRateFormatted: string;
}

interface PdfReservationRow extends ReportReservation {
    revenueInPeriodFormatted: string;
}

interface RoomsReportPdfContext {
    generatedAt: string;
    period: string;
    roomsFilter: string;
    statusesFilter: string;
    summary: RoomsReport['summary'] & {
        revenueFormatted: string;
        averageDailyRateFormatted: string;
    };
    byRooms: PdfGroupRow[];
    byMonths: PdfGroupRow[];
    reservations: PdfReservationRow[];
}

@Injectable()
export class ReportsPdfService {
    async buildRoomsReportPdf(report: RoomsReport): Promise<Buffer> {
        const template = await this.getTemplate();
        const html = template(this.toTemplateContext(report));
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, {
                waitUntil: 'load',
            });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '16mm',
                    right: '14mm',
                    bottom: '16mm',
                    left: '14mm',
                },
            });

            return Buffer.from(pdf);
        } finally {
            await browser.close();
        }
    }

    private async getTemplate(): Promise<Handlebars.TemplateDelegate> {
        const templatePath = await this.resolveTemplatePath();
        const source = await readFile(templatePath, 'utf8');
        return Handlebars.compile(source);
    }

    private async resolveTemplatePath(): Promise<string> {
        const paths = [
            join(__dirname, 'templates', 'rooms-report.hbs'),
            join(process.cwd(), 'src', 'reports', 'templates', 'rooms-report.hbs'),
        ];

        for (const path of paths) {
            try {
                await readFile(path, 'utf8');
                return path;
            } catch {
                continue;
            }
        }

        return paths[0];
    }

    private toTemplateContext(report: RoomsReport): RoomsReportPdfContext {
        const selectedStatuses = report.availableStatuses
            .filter((status) => report.filters.statusIds.includes(status.id))
            .map((status) => status.name)
            .join(', ');

        return {
            generatedAt: new Intl.DateTimeFormat('ru-RU', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date()),
            period: `${report.filters.dateFrom ?? 'с начала'} - ${
                report.filters.dateTo ?? 'без ограничения'
            }`,
            roomsFilter:
                report.filters.roomIds.length > 0
                    ? `Выбрано комнат: ${report.filters.roomIds.length}`
                    : 'Все комнаты',
            statusesFilter: selectedStatuses || 'Статусы не выбраны',
            summary: {
                ...report.summary,
                revenueFormatted: this.formatMoney(report.summary.revenue),
                averageDailyRateFormatted: this.formatMoney(
                    report.summary.averageDailyRate,
                ),
            },
            byRooms: this.toGroupRows(report.byRooms),
            byMonths: this.toGroupRows(report.byMonths),
            reservations: report.reservations.map((reservation) => ({
                ...reservation,
                revenueInPeriodFormatted: this.formatMoney(
                    reservation.revenueInPeriod,
                ),
            })),
        };
    }

    private toGroupRows(rows: ReportGroup[]): PdfGroupRow[] {
        return rows.map((row) => ({
            ...row,
            revenueFormatted: this.formatMoney(row.revenue),
            averageDailyRateFormatted: this.formatMoney(row.averageDailyRate),
        }));
    }

    private formatMoney(value: number): string {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
        }).format(value);
    }
}
