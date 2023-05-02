import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpiryTime } from 'config';
import { CreateKeyDto } from 'src/dtos/Key.dto';
import { Key } from 'src/entities/Key.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KeyService {
    constructor(
        @InjectRepository(Key) private readonly keyRepository: Repository<Key>,
    ) {}

    async createKey(data: CreateKeyDto): Promise<Key> {
        const randomKey = uuidv4();

        const keyEntity = this.keyRepository.create({
            key: randomKey,
            generated_by: data.userId,
            session_id: data.sessionId,
        });

        const savedKey = await this.keyRepository.save(keyEntity);

        // await this.deleteQueue.add({
        //   timestamp: new Date().getTime() / 1000,
        // });

        return savedKey;
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
}
