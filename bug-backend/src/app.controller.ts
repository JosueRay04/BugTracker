import { Controller, Get, Post,Param,Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage : diskStorage({
          destination : './uploads',
          filename : function(req, file, cb){
            cb(null, file.originalname)
          }
        })
      }
    )
  )

  @Post('file')
  uploadFile(@UploadedFile() file : Express.Multer.File){
    return {
      msg : `Archivo ${file.filename} cargado correctamente` 
    };
  }

  @Get('file/:filename')
getImage(@Param('filename') filename: string, @Res() res): void {
  const imagePath = join(__dirname, '..', 'uploads', filename);
  const stream = createReadStream(imagePath);

  res.setHeader('Content-Type', 'image/png'); // Ajusta el tipo de contenido según tu tipo de imagen

  stream.pipe(res);
}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
