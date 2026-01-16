import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Campaign } from '../campanias/campania.entity';
import { Customer } from '../campanias/customer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  customer_id: number;

  @ManyToOne(() => Customer, (customer) => customer.users, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  deleted: number;

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];
}
