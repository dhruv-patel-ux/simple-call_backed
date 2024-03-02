import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from 'src/common-services/commonService.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private commonService: CommonService
  ) { }
  async create(createUserDto: CreateUserDto) {
    const findUser = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (findUser) return {
      status: false,
      statusCode: 422,
      message: 'Email Already Exist'
    };
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();

    if (!user) return {
      status: false,
      statusCode: 400,
      message: 'Failed To Create User '
    };

    const accessToken = await this.commonService.generateToken(user);
    return {
      status: true,
      statusCode: 201,
      message: "User Created Successfull",
      data: user,
      accessToken
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    if (!id) return
    return this.userModel.findById(id)
  }
  findOneByMail(email: number) {
    if (!email) return
    return this.userModel.findOne({ email })
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
