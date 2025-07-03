import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';
import { User } from './entities/user.entity';
import { Roles } from '@/decorators/roles.decorator';
import { USER_ROLE } from '../user-roles/entities/user-role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll({});
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
