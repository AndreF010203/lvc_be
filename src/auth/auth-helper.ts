import * as bcrypt from 'bcrypt';

export function checkPassword(pwd: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pwd, hash);
}

export function hashPassword(pwd: string): Promise<string>{
  return bcrypt.hash(pwd, 10);
}
