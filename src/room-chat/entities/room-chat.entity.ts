
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type ChatRoomDocument = HydratedDocument<RoomChat>;

@Schema()
export class RoomChat {
    @Prop({ required: true })
    roomId: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ required: true })
    message: string;

}
export const RoomChatSchema = SchemaFactory.createForClass(RoomChat);