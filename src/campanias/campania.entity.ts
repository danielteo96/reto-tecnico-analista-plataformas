import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50, nullable: true })
  name: string;

  @Column({ type: 'date', nullable: true })
  process_date: Date;

  @Column({ type: 'time', nullable: true })
  process_hour: string;

  @Column({ type: 'int', nullable: true })
  total_records: number;

  @Column({ type: 'int', default: 0 })
  total_sent: number;

  @Column({ type: 'int', default: 0 })
  total_error: number;

  @Column({ type: 'int', nullable: true })
  process_status: number;

  @Column({ type: 'time', nullable: true })
  final_hour: string;

  @OneToMany(() => Message, (message) => message.campaign)
  messages: Message[];
}
