import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { toUserDto, UserDto } from 'src/user/dto/user.dto';
import { checkPassword, hashPassword } from './auth-helper';
import { JwtToken } from './interfaces/jwt-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    createUserDto.password = await hashPassword(createUserDto.password);
    const user = await this.userService.insertUser(createUserDto);
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<JwtToken> {
    console.log(loginUserDto);
    return this.userService
      .findOneLogin(loginUserDto.email)
      .then(async (user) => {
        console.log(user);
        const res = await checkPassword(loginUserDto.password, user.password);
        if (res) {
          return { token: this.signToken(toUserDto(user)) };
        } else {
          throw new UnauthorizedException();
        }
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  async verifyPayload(payload: JwtPayload): Promise<UserDto> {
    let user: UserDto;
    try {
      user = await this.userService.findOne({
        where: { email: payload.email },
      });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.email}`,
      );
    }
    return user;
  }

  signToken(user: UserDto): string {
    const payload = {
      sub: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
