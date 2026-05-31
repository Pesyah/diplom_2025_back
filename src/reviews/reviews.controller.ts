import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { CreateRoomReviewDto } from './dto/create-room-review.dto';
import { ReviewsService } from './reviews.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get('by-room/:roomId')
    @ApiOperation({ summary: 'Получить отзывы по номеру' })
    async findByRoom(@Param('roomId', ParseUUIDPipe) roomId: string) {
        return this.reviewsService.findByRoom(roomId);
    }

    @Get('my')
    @ApiOperation({ summary: 'Получить мои отзывы' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'manager', 'guest')
    async findMy(@GetUser() user: Users) {
        return this.reviewsService.findMy(user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Оставить отзыв по номеру' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('guest')
    async create(@Body() dto: CreateRoomReviewDto, @GetUser() user: Users) {
        return this.reviewsService.create(dto, user.id);
    }

    @Delete('by-id/:id')
    @ApiOperation({ summary: 'Удалить отзыв (admin)' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.reviewsService.delete(id);
    }
}
