import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { campaniasController } from './campania.controllers';
import { campaniasService } from './campanias.service';
import { Campaign } from './campania.entity';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Message])],
  controllers: [campaniasController],
  providers: [campaniasService],
})
export class CampaniasModule {}
