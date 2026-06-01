
import * as bcrypt from 'bcrypt';
const saltRounds = 10;
// 密码加密
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, saltRounds);
}
// 密码校验
export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
