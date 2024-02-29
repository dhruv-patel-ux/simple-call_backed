import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IsNotEmpty } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    @IsNotEmpty()
    name: string;

    @Prop()
    @IsNotEmpty()
    email: string;

    @Prop()
    @IsNotEmpty()
    password: string;

    @Prop()
    number: number
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<UserDocument>('save', async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
})
