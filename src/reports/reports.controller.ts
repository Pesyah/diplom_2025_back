import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { RoomsReportQueryDto } from './dto/rooms-report-query.dto';
import { ReportsPdfService } from './reports-pdf.service';
import { ReportsService, RoomsReport } from './reports.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
        private readonly reportsPdfService: ReportsPdfService,
    ) {}

    @Get('rooms')
    @ApiOperation({ summary: 'Build rooms report by optional rooms and dates' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async getRoomsReport(
        @Query() query: RoomsReportQueryDto,
    ): Promise<RoomsReport> {
        return this.reportsService.getRoomsReport(query);
    }

    @Get('rooms/pdf')
    @ApiOperation({ summary: 'Download rooms report as PDF' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    async downloadRoomsReportPdf(
        @Query() query: RoomsReportQueryDto,
        @Res() response: Response,
    ): Promise<void> {
        const report = await this.reportsService.getRoomsReport(query);
        const pdf = await this.reportsPdfService.buildRoomsReportPdf(report);

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader(
            'Content-Disposition',
            'attachment; filename="rooms-report.pdf"',
        );
        response.send(pdf);
    }
}
