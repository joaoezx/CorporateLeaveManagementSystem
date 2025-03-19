import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // Injeção do repositório do TypeORM para a entidade User
    private userModel: Model<User>, // Repositório de usuários
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  getAllUsers() {
    return this.userModel.find(); // Retorna todos os usuários da base de dados
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }); // Busca o usuário pelo email
  }

  getUserById(id: string) {
    return this.userModel.findById(id); // Busca o usuário pelo ID
  }

  async promotion(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }); // Atualiza os dados do usuário
  }

  async resignation(id: string) {
    const result = await this.userModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount > 0 }; // Remove o usuário da base de dados pelo ID
  }
}
