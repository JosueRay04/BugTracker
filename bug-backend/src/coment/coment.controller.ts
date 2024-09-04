import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ComentService } from './coment.service';
import { coment } from './coment.entity';
import { CreateComentDto } from './dto/createComentDto';
import { UpdateComentDto } from './dto/updateComentDto';

@Controller('coment')
export class ComentController {
    constructor(private comentService: ComentService) {

    }

    @Get()
    getComents(): Promise<coment[]> {
        return this.comentService.getComents();
    }

    @Get(':id')
    getComent(@Param('id', ParseIntPipe) id: number) {
        return this.comentService.getComent(id);
    }

    @Post('createComent')
    createComent(@Body() newComent: CreateComentDto) {
        this.comentService.createComent(newComent);
    }

    @Delete(':id')
    deleteComent(@Param('id', ParseIntPipe) id: number) {
        return this.comentService.deleteComent(id);
    }

    @Patch()
    updateComent(@Param('id', ParseIntPipe) id: number, @Body() coment: UpdateComentDto) {
        
    }
}
