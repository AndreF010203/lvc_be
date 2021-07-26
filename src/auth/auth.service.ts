import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/users.service';
import { User } from 'src/user/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUp: CreateUserDto): Promise<string> {
    const userId = await this.userService.insertUser(signUp);
    return userId;
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.userService.findOne(loginUserDto.email);
    return this.userService
      .checkPassword(loginUserDto.password, user.password)
      .then((res) => {
        if (res) {
          return this.signToken(user);
        } else {
          throw new UnauthorizedException();
        }
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne(payload.email);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.email}`,
      );
    }
    delete user.password;
    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
