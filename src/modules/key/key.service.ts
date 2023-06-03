import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { ExpiryTime, verificationMessage } from 'config';
import { ethers } from 'ethers';
import { CreateKeyDto } from 'src/dtos/Key.dto';
import { Key } from 'src/entities/Key.entity';
import { Manager } from 'src/entities/Manager.entity';
import { Session } from 'src/entities/Session.entity';
import { BadRequest, UnAuthorized } from 'src/errors/errors';
import { grantAccess } from 'src/helpers/orbisFunctions';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KeyService {
    constructor(
        @InjectRepository(Key) private readonly keyRepository: Repository<Key>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectQueue('keyCleaner') private keyCleaner: Queue,
    ) {}

    async createKey(signature: string, data: CreateKeyDto): Promise<Key> {
        const verification = ethers.utils.verifyMessage(
            verificationMessage,
            signature,
        );
        const user = await this.managerRepository.findOneBy({
            address: verification.toLowerCase(),
        });

        const session = await this.sessionRepository.findOneBy({
            id: data.sessionId,
        });
        if (
            session.organization_id == user.organization_id ||
            user.organization_id == 0
        ) {
            const randomKey = uuidv4();

            const keyEntity = this.keyRepository.create({
                key: randomKey,
                generated_by: user.id,
                session_id: data.sessionId,
            });

            const savedKey = await this.keyRepository.save(keyEntity);
            await this.keyCleaner.add({
                timestamp: new Date().getTime() / 1000,
            });

            return savedKey;
        } else {
            UnAuthorized('UnAuthorized');
        }
    }
    async isValid(key: string) {
        const keyEntity = await this.keyRepository.findOneBy({ key });
        if (!keyEntity) return { render: false, mint: false };
        const keyTimestamp = new Date(keyEntity['created_at']).getTime() / 1000;
        const currentTime = new Date().getTime() / 1000;
        const render = currentTime - keyTimestamp < ExpiryTime.Render;
        const mint = currentTime - keyTimestamp < ExpiryTime.Mint;
        return { render, mint };
    }

    async requestAccess(signature: string, key: string) {
        const keyEntity = await this.keyRepository.findOne({
            where: { key },
            relations: { session: true },
        });
        console.log(keyEntity);
        const isValid = await this.isValid(key);
        if (!isValid.mint) {
            BadRequest('Key is expired!');
        }
        const verification = ethers.utils.verifyMessage(
            verificationMessage,
            signature,
        );
        return await grantAccess(
            verification,
            keyEntity.session.name,
            keyEntity.session.id,
        );
    }
}
