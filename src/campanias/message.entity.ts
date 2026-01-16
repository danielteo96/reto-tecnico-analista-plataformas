import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campaign } from '../campanias/campania.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  text: string;

  @Column({
    name: 'shipping_status',
    type: 'tinyint',
    default: 1,
  })
  shippingStatus: number;

  @Column({
    name: 'shipping_hour',
    type: 'time',
    nullable: true,
  })
  shippingHour: string;

  @ManyToOne(() => Campaign, campaign => campaign.messages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;
}
