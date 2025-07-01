import { Controller, Post, Body } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { Public } from '@/decorators/auth.decorator';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Public()
  @Post()
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return await this.userRolesService.create(createUserRoleDto);
  }

  // @Get()
  // findAll() {
  //   return this.userRolesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userRolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserRoleDto: UpdateUserRoleDto,
  // ) {
  //   return this.userRolesService.update(+id, updateUserRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userRolesService.remove(+id);
  // }
}
