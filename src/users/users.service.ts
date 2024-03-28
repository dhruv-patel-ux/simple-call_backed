import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from 'src/common-services/commonService.service';
import * as mongoose from 'mongoose';
import * as fs from 'fs';

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

  findAll(SearchTerm?: any) {
    return this.userModel.find({ name: { $regex: SearchTerm, $options: 'i' } });
  }

  findOne(id: any) {
    if (!id) return
    return this.userModel.findById(id)
  }

  async findUserProfile(id: any) {
    try {
      if (!id) return {
        statusCode: 400,
        message: "Id Is required",
        status: false
      }
      const _id = new mongoose.Types.ObjectId(id);
      const user = await this.userModel.findById(_id);
      if (!user) return {
        statusCode: 400,
        message: "User Not Found",
        status: false
      }
      return {
        statusCode: 200,
        data: { name: user?.name, avatar: user.avatar },
        status: true
      }
    } catch (e) {
      console.log(e);

      return {
        statusCode: 500,
        message: e.message,
        status: false
      }
    }

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
  async updateProfile(data: any) {
    try {
      const uploadPath = 'public/user-avatars'; // Specify your upload directory
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Save the file to the specified directory
      const filePath = `${uploadPath}/${data.user._id}_${data?.file.originalname}`;
      fs.writeFileSync(filePath, data?.file.buffer);
      await this.userModel.updateOne(
        { _id: data.user._id },
        { avatar: filePath })

      return {
        statusCode: 201,
        success: true,
        message: "Profile Update Successfully",
        url: `E:/simply chat/simple-call_backed/public/user-avatars/${data?.file.originalname}`
      }
    } catch (e) {
      console.log(e);

      return {
        statusCode: 500,
        success: false,
        message: e.messgae,
        url: ''
      }
    }
  }
}
