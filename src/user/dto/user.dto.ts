import { FullUserDto } from './full-user.dto';

export class UserDto {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export function toUserDto(data: FullUserDto): UserDto {
  const { id, name, surname, email } = data;
  return { id, name, surname, email };
}
