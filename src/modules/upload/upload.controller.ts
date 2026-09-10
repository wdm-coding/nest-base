import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { Public } from '@/common/decorators/public.decorator';
import { UploadService, UPLOAD_DIR, UploadFileVo } from './upload.service';

// 允许上传的文件扩展名
const ALLOWED_EXT = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.zip', '.rar', '.mp4', '.mp3',
];

// 单文件大小限制 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// multer 磁盘存储配置：文件名加 uuid 防止重名覆盖
const storage = diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${randomUUID()}${extname(file.originalname)}`);
  },
});

// 文件类型白名单过滤
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!ALLOWED_EXT.includes(extname(file.originalname).toLowerCase())) {
    return cb(new BadRequestException({ message: '不支持的文件类型' }), false);
  }
  cb(null, true);
};

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 单文件上传
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const data: UploadFileVo = this.uploadService.toVo(file);
    return { data };
  }

  // 多文件上传（最多 10 个）
  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const data: UploadFileVo[] = files.map((file) => this.uploadService.toVo(file));
    return { data };
  }

  // 文件访问（公开接口，供前端直接通过 url 展示）
  @Public()
  @Get('file/:filename')
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.uploadService.resolvePath(filename);
    res.sendFile(filePath);
  }
}
