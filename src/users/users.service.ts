import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  users: CreateUserDto[] = [];

  createUser(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);
    return createUserDto;
  }

  getAllUsers(): CreateUserDto[] {
    return this.users;
  }

  getUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user` + updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
