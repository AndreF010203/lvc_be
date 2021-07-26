import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAll();
  }
  /*

  @Get(':id')
  getProduct(@Param('id') prodId: string) {
    //return this.userService.getSingleUser(prodId);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    //await this.userService.updateUser(prodId, prodTitle, prodDesc, prodPrice);
    return null;
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
    //await this.userService.deleteUser(prodId);
    return null;
  }
  */
}
