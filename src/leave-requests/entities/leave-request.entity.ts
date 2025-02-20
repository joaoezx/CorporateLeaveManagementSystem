import { User } from '../../users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.leaveRequests)
  employee: User;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  leaveType: string; // "Vacation", "Sick Leave"

  @Column({ default: 'Pending' })
  status: string; // Pending, Approved, Rejected
}
