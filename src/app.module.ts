import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaniasModule } from './campanias/campanias.module';


import { Campaign } from './campanias/campania.entity';
import { User } from './campanias/user.entity';
import { Customer } from './campanias/customer.entity';
import { Message } from './campanias/message.entity';


@Module({
   imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Soporte23',
      database: 'test_db',
      entities: [Campaign, User, Customer, Message],
      autoLoadEntities: true,
      synchronize: true, 
    }),   CampaniasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

