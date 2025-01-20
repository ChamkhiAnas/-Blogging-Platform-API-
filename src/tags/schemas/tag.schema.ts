import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Tag {
    @Prop({required:true})
    name:string

    @Prop({type:[{type:Types.ObjectId,ref:'Post'}]})
    posts:Types.ObjectId[];
}

export const TagSchema = SchemaFactory.createForClass(Tag)