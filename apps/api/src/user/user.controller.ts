import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get("/activities")
  getActivities(){
     return this.userService.getRecentActivities()
  }

  @UseGuards(AuthGuard)
  @Get("/stats")
  async getStats(@Request() req: any) {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'user') {
      return this.userService.getUserStats(userId);
    }

    if (role === 'owner') {
      return this.userService.getOwnerStats(userId);
    }

    if (role === 'admin') {
      return this.userService.getAdminStats();
    }

    return { message: 'Invalid role' };
  }

  @UseGuards(AuthGuard)
  @Get('property')
  findUserProperties(@Request() req) {
    return this.userService.findUserProperties(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
