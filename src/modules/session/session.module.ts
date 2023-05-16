import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/entities/Session.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Manager } from 'src/entities/Manager.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Session, Manager])],
    providers: [SessionService],
    controllers: [SessionController],
})
export class SessionModule {}
