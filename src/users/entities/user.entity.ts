import { LeaveRequest } from '../../leave-requests/entities/leave-request.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  department: string;

  @Column()
  role: string;

  @OneToMany(() => LeaveRequest, leaveRequest => leaveRequest.employee)
  leaveRequests: LeaveRequest[];
}
