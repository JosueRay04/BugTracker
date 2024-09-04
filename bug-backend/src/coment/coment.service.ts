import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { coment } from './coment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComentDto } from './dto/createComentDto';
import { UpdateComentDto } from './dto/updateComentDto';

@Injectable()
export class ComentService {
    constructor(@InjectRepository(coment) private comentRepository: Repository<coment>) {
        
    }

    createComent(coment: CreateComentDto) {
        const newComent = this.comentRepository.create(coment);
        this.comentRepository.save(newComent);
    }

    getComents() {
        return this.comentRepository.find();
    }

    async getComent(id: number) {
        const comentFound = await this.comentRepository.findOne({where: { id }});

        if(!comentFound) {
            return new HttpException('Coment not found', HttpStatus.NOT_FOUND);
        }
    }

    async deleteComent(id: number) {
        const result = await this.comentRepository.delete({ id });

        if(result.affected === 0) {
            return new HttpException('Coment not found', HttpStatus.NOT_FOUND);
        }
    }

    async updateComent(id: number, coment: UpdateComentDto) {
        const comentFound = await this.comentRepository.findOne({where: { id }});

        if(!comentFound) {
            return new HttpException('Coment not found', HttpStatus.NOT_FOUND);
        }

        const updateComent = Object.assign(comentFound, coment);
        return this.comentRepository.save(updateComent);
    }
}


