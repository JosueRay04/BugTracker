import { Module } from '@nestjs/common';
import { ComentController } from './coment.controller';
import { ComentService } from './coment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { coment } from './coment.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([coment]),
    UserModule
  ],
  controllers: [ComentController],
  providers: [ComentService]
})
export class ComentModule {}
