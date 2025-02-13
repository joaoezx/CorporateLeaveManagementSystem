import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('profile/:id')
  @UseGuards(AuthGuard('jwt')) // Protege a rota com o guard de autenticação JWT
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user; // Retorna o usuário encontrado
  }

  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id); // Retorna o usuário encontrado pelo ID
  }

  @Put('update/:id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.promotion(id, updateUserDto); // serviço para promover o usuário
  }

  @Delete('resignation/:id')
  remove(@Param('id') id: string) {
    return this.usersService.resignation(id); // serviço para remover o usuário
  }
}
