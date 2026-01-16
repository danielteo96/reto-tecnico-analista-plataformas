import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from '../campanias/user.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  name: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  deleted: number;

  @OneToMany(() => User, (user) => user.customer)
  users: User[];
}
