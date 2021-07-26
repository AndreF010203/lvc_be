import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    let user: User;
    try {
      user = await this.userModel
        .findOne((u: User) => u.email === email)
        .exec();
    } catch (error) {
      return user;
    }
    return user;
  }

  async insertUser(data: CreateUserDto): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    const newUser = new this.userModel(data);
    const result = await newUser.save();
    return result.id;
  }

  async checkPassword(passwordToCheck, password): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(passwordToCheck, password, (err, isMatch) => {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
  }
}
