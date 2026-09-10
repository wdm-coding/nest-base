import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// 上传文件目录（项目根目录/upload）
export const UPLOAD_DIR = join(process.cwd(), 'upload');

// 上传文件返回结构
export interface UploadFileVo {
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  constructor() {
    // 确保上传目录存在
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  // 将 multer 文件信息转换为返回结构
  toVo(file: Express.Multer.File): UploadFileVo {
    return {
      url: `/upload/file/${file.filename}`,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  // 根据文件名解析磁盘绝对路径，防止路径穿越
  resolvePath(filename: string): string {
    if (/[\\/]/.test(filename) || filename.includes('..')) {
      throw new BadRequestException({ message: '非法的文件名' });
    }
    const filePath = join(UPLOAD_DIR, filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException({ message: '文件不存在' });
    }
    return filePath;
  }
}
