
import { User as UserEntity } from '@/modules/user/entities/user.entity';
declare global {
  namespace Express {
    // 👇 这里是关键：强制覆盖 passport 自带的空 User 类型
    interface User extends UserEntity {
      userId: string;
    }

    interface Request {
      user: User;
    }
  }
}

export {};