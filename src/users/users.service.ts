import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Injeção do repositório do TypeORM para a entidade User
    private readonly userRepository: Repository<User>, // Repositório de usuários
  ) {}

  createUser(createUserDto: CreateUserDto) {
    // Cria uma instância de usuário com base no DTO, mas ainda não salva
    this.userRepository.create(createUserDto);
    // Salva o usuário na base de dados
    return this.userRepository.save(createUserDto);
  }

  getAllUsers() {
    return this.userRepository.find(); // Retorna todos os usuários da base de dados
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } }); // Busca o usuário pelo email
  }

  getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } }); // Busca o usuário pelo ID
  }

  async promotion(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto); // Atualiza os dados do usuário
    return this.userRepository.findOne({ where: { id } }); // Retorna o usuário atualizado
  }

  resignation(id: string) {
    return this.userRepository.delete(id); // Remove o usuário da base de dados pelo ID
  }
}
