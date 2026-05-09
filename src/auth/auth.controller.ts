import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Roles } from './decorators/role.decorator';
import {
    ChangePasswordDto,
    LoginDto,
    RegisterDto,
    ResetPasswordDto,
} from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';
import { RolesGuard } from './guard/rolesGuard';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('login')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    async register(@Body() body: RegisterDto) {
        return this.authService.signOn(
            body.name,
            body.email,
            body.password,
            body.phone,
        );
    }

    @Post('/login')
    async login(@Body() body: LoginDto) {
        return this.authService.signIn(body.email, body.password);
    }

    @ApiResponse({ description: 'ok' })
    @Post('/reset-password')
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body.email);
    }

    @ApiOperation({ summary: 'Авторизация' })
    @UseGuards(AuthGuard)
    @Post('/change-password')
    async changePassword(
        @Body() body: ChangePasswordDto,
        @GetUser() user: Users,
    ) {
        return this.authService.changePassword(
            user,
            body.oldPassword,
            body.newPassword,
        );
    }

    @ApiOperation({ summary: 'Авторизация' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @Post('/create-admin')
    async createAdmin(@Body() body: RegisterDto) {
        return this.authService.createAdmin(body);
    }

    @ApiOperation({ summary: 'Авторизация' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'moderator')
    @Get('/user-by-query/:query')
    async usersByQuery(@Param('query') query: string) {
        return this.authService.usersByQuery(query);
    }

    @ApiOperation({ summary: 'Авторизация' })
    @UseGuards(AuthGuard)
    @Patch('/update-user')
    async updateUser(@GetUser() user: Users, @Body() body: UpdateUserDto) {
        return this.authService.updateUser(user, body);
    }

    @ApiOperation({ summary: 'Авторизация' })
    @UseGuards(AuthGuard)
    @Get('/me')
    async getMe(@GetUser() user: Users) {
        return this.authService.getMe(user);
    }
}
