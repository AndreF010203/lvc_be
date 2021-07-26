import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { toUserDto, UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FullUserDto } from './dto/full-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<FullUserDto>) {}

  async findOne(options?: Record<string, unknown>): Promise<UserDto> {
    const user = await this.userModel.findOne(options);
    return toUserDto(user);
  }

  findOneLogin(email: string) {
    return this.userModel.findOne({ email });
  }

  async insertUser(data: CreateUserDto): Promise<UserDto> {
    // check if the user exists in the db
    const userInDb = await this.userModel.findOne({ email: data.email });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(data);
    return await createdUser.save();
  }

  async getAll(): Promise<UserDto[]> {
    const users = await this.userModel.find();
    return users.map((u) => toUserDto(u));
  }
}
