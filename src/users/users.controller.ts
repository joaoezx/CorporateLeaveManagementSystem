import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put('update/:id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.promotion(id, updateUserDto);
  }

  @Delete('resignation/:id')
  remove(@Param('id') id: string) {
    return this.usersService.resignation(id);
  }
}
