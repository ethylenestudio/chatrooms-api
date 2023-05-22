import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { ExpiryTime } from 'config';
import { Key } from 'src/entities/Key.entity';
import { Repository } from 'typeorm';

@Processor('keyCleaner')
export class KeyCleanerService {
    constructor(
        @InjectRepository(Key) private readonly keyRepository: Repository<Key>,
    ) {}

    @Process()
    async delete(job: Job<{ timestamp: number }>) {
        try {
            const allKeys = await this.keyRepository.find();
            const keysToRemove = [];
            for (const key of allKeys) {
                const keyStamp = new Date(key.created_at).getTime() / 1000;
                if (!(job.data.timestamp - keyStamp < ExpiryTime.Mint)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(
                async (key) => await this.keyRepository.remove(key),
            );
        } catch (e) {
            console.log(e);
        }
    }
}
