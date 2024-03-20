import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type UserDocument = HydratedDocument<Room>;

@Schema()
export class Room {
    @Prop({ required: true })
    roomId: string;

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', required: true })
    usersId: [];

}
export const RoomSchema = SchemaFactory.createForClass(Room);