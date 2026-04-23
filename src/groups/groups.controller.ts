import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Users } from 'src/auth/entities/users.entity';
import { RolesGuard } from 'src/auth/guard/rolesGuard';
import { AssignUserStructureDto } from './dto/assign-user-structure.dto';
import { SearchByPathParams, SearchQueryDto } from './dto/search-query.dto';
import { SearchUsersQueryDto } from './dto/search-users.dto';
import { Department } from './entities/department.entity';
import { Faculty } from './entities/faculty.entity';
import { Groups } from './entities/group.entity';
import { GroupsService } from './groups.service';

@ApiSecurity('X-AUTH-TOKEN')
@ApiTags('Структура университета')
@Controller('structure') // Изменил на /structure для большей семантики
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    // 1. Поиск факультетов
    @Get('faculties')
    @ApiOperation({ summary: 'Поиск факультетов' })
    @ApiQuery({
        name: 'query',
        required: false,
        type: String,
        description: 'Строка поиска (по названию или короткому имени)',
    })
    @ApiResponse({
        status: 200,
        description: 'Список факультетов (макс. 10)',
        type: [Faculty],
    })
    async searchFaculties(
        @Query() searchDto: SearchQueryDto,
    ): Promise<Faculty[]> {
        return this.groupsService.searchFaculties(searchDto.query);
    }

    @Get('faculties/by-query/:query')
    @ApiOperation({ summary: 'Поиск факультетов (запрос в пути)' })
    @ApiParam({ name: 'query', required: true, description: 'Строка поиска' })
    @ApiResponse({
        status: 200,
        description: 'Список факультетов (макс. 10)',
        type: [Faculty],
    })
    async searchFacultiesByPath(
        @Param() params: SearchByPathParams,
    ): Promise<Faculty[]> {
        return this.groupsService.searchFaculties(params.query);
    }

    // 2. Поиск кафедр
    @Get('departments')
    @ApiOperation({ summary: 'Поиск кафедр' })
    @ApiQuery({
        name: 'query',
        required: false,
        type: String,
        description: 'Строка поиска по названию кафедры',
    })
    @ApiResponse({
        status: 200,
        description: 'Список кафедр с информацией о факультете (макс. 10)',
        type: [Department],
    })
    async searchDepartments(
        @Query() searchDto: SearchQueryDto,
    ): Promise<Department[]> {
        return this.groupsService.searchDepartments(searchDto.query);
    }

    @Get('departments/by-query/:query')
    @ApiOperation({ summary: 'Поиск кафедр (запрос в пути)' })
    @ApiParam({ name: 'query', required: true, description: 'Строка поиска' })
    @ApiResponse({
        status: 200,
        description: 'Список кафедр с информацией о факультете (макс. 10)',
        type: [Department],
    })
    async searchDepartmentsByPath(
        @Param() params: SearchByPathParams,
    ): Promise<Department[]> {
        return this.groupsService.searchDepartments(params.query);
    }

    // 3. Поиск групп
    @Get('groups')
    @ApiOperation({ summary: 'Поиск учебных групп' })
    @ApiQuery({
        name: 'query',
        required: false,
        type: String,
        description: 'Строка поиска по названию или коду группы',
    })
    @ApiResponse({
        status: 200,
        description: 'Список групп с информацией о кафедре (макс. 10)',
        type: [Groups],
    })
    async searchGroups(@Query() searchDto: SearchQueryDto): Promise<Groups[]> {
        return this.groupsService.searchGroups(searchDto.query);
    }

    @Get('groups/by-query/:query')
    @ApiOperation({ summary: 'Поиск учебных групп (запрос в пути)' })
    @ApiParam({ name: 'query', required: true, description: 'Строка поиска' })
    @ApiResponse({
        status: 200,
        description: 'Список групп с информацией о кафедре (макс. 10)',
        type: [Groups],
    })
    async searchGroupsByPath(
        @Param() params: SearchByPathParams,
    ): Promise<Groups[]> {
        return this.groupsService.searchGroups(params.query);
    }

    // 4. Получение конкретных сущностей по ID (опционально, но полезно)
    @Get('faculties/:id')
    @ApiOperation({ summary: 'Получить факультет по ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID факультета' })
    @ApiResponse({ status: 200, type: Faculty })
    async getFaculty(@Param('id', ParseIntPipe) id: number): Promise<Faculty> {
        return this.groupsService.getFacultyById(id);
    }

    @Get('departments/:id')
    @ApiOperation({ summary: 'Получить кафедру по ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID кафедры' })
    @ApiResponse({ status: 200, type: Department })
    async getDepartment(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Department> {
        return this.groupsService.getDepartmentById(id);
    }

    @Get('groups/:id')
    @ApiOperation({ summary: 'Получить группу по ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID группы' })
    @ApiResponse({ status: 200, type: Groups })
    async getGroup(@Param('id', ParseIntPipe) id: number): Promise<Groups> {
        return this.groupsService.getGroupById(id);
    }

    // 6. Поиск пользователей (кроме админов)
    @Get('users')
    @ApiOperation({ summary: 'Поиск пользователей (не админов)' })
    @ApiQuery({
        name: 'query',
        required: false,
        type: String,
        description: 'Строка поиска по имени, фамилии, email или телефону',
    })
    @ApiResponse({
        status: 200,
        description:
            'Список пользователей (макс. 10) с информацией о группе, кафедре, факультете',
        type: [Users],
    })
    async searchUsers(
        @Query() searchDto: SearchUsersQueryDto,
    ): Promise<Users[]> {
        return this.groupsService.searchUsers(searchDto.query);
    }

    // 5. Назначение пользователю структурной принадлежности
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Post('assign-structure')
    @ApiOperation({
        summary:
            'Назначить пользователю факультет, кафедру и/или группу (передача 0 очищает поле)',
    })
    @ApiBody({ type: AssignUserStructureDto })
    @ApiResponse({
        status: 200,
        description: 'Обновлённый пользователь',
        type: Users,
    })
    async assignStructure(@Body() dto: AssignUserStructureDto) {
        return this.groupsService.assignUserStructure(dto);
    }
}
