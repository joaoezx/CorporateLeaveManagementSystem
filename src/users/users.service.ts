import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    this.userRepository.create(createUserDto);
    return this.userRepository.save(createUserDto);
  }

  getAllUsers() {
    return this.userRepository.find();
  }

  getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async promotion(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  resignation(id: string) {
    return this.userRepository.delete(id);
  }
}
