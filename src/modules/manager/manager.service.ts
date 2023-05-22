import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verificationMessage } from 'config';
import { ethers } from 'ethers';
import { CreateManagerDto } from 'src/dtos/Manager.dto';
import { Manager } from 'src/entities/Manager.entity';
import { BadRequest, UnAuthorized } from 'src/errors/errors';
import { isNumeric } from 'src/helpers/isNumeric';
import { Repository } from 'typeorm';

@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
    ) {}

    async findById(id: string): Promise<Manager> {
        if (!isNumeric(id)) {
            BadRequest('Id should be a valid numeric value.');
        }

        return await this.managerRepository.findOneBy({ id: Number(id) });
    }

    async createManager(
        signature: string,
        data: CreateManagerDto,
    ): Promise<Manager> {
        try {
            const { address, organizationId } = data;

            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                signature,
            );
            const manager = await this.managerRepository.findOne({
                where: { address: verification.toLowerCase() },
                relations: { manages: true },
            });

            if (
                manager.organization_id != organizationId &&
                manager.organization_id != 0
            ) {
                UnAuthorized('Cant change another organizations schema!');
            }

            if (!manager) {
                BadRequest('No manager found!');
            }

            const isExist = await this.managerRepository.findOneBy({
                address,
            });

            if (isExist) {
                BadRequest('Manager address already exists.');
            }

            const isAddressValid = ethers.utils.isAddress(data.address);
            if (!isAddressValid) {
                BadRequest('Address is not valid!');
            }

            const newManager = this.managerRepository.create({
                address: address.toLowerCase(),
                organization_id: organizationId,
            });

            return await this.managerRepository.save(newManager);
        } catch (e) {
            BadRequest(e.message);
        }
    }
    async adminOrManager(signature: string) {
        try {
            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                signature,
            );
            const manager = await this.managerRepository.findOne({
                where: { address: verification.toLowerCase() },
                relations: { manages: true },
            });
            if (!manager) {
                BadRequest('No manager found!');
            }
            let response = { admin: false, manager: false };
            if (manager.manages) {
                response = { ...response, manager: true };
            }
            if (manager.organization_id == 0) {
                response = { ...response, admin: true };
            }
            return response;
        } catch (e) {
            BadRequest(e.message);
        }
    }
    async deleteManager(signature: string, managerId: number) {
        try {
            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                signature,
            );
            const manager = await this.managerRepository.findOne({
                where: { address: verification.toLowerCase() },
                relations: { manages: true },
            });
            if (!manager) {
                BadRequest('No manager found!');
            }
            if (manager.manages) {
                return await this.managerRepository.delete({
                    id: managerId,
                });
            } else {
                UnAuthorized('Unauthorized!');
            }
        } catch (e) {
            BadRequest(e.message);
        }
    }

    async findBySignature(signature: string, organizationId: string) {
        try {
            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                signature,
            );
            const manager = await this.managerRepository.findOne({
                where: { address: verification.toLowerCase() },
                relations: { manages: true },
            });
            if (!manager) {
                BadRequest('No manager found!');
            }
            if (
                manager.organization_id != Number(organizationId) &&
                manager.organization_id != 0
            ) {
                UnAuthorized('Unauthorized');
            }
            const managers = await this.managerRepository.find({
                where: {
                    organization_id: Number(organizationId),
                },
                relations: {
                    manages: true,
                },
                order: {
                    managed_organization: 'ASC',
                    id: 'DESC',
                },
            });
            return managers;
        } catch (e) {
            BadRequest(e.message);
        }
    }
}
