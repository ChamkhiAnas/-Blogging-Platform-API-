import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Post {

    @Prop({required:true})
    title:string;

    @Prop({required:true})
    content:string

    @Prop({type:[{type:Types.ObjectId,ref:'Tag'}]})
    tags:Types.ObjectId[];

    @Prop({type:Types.ObjectId,ref:'Category'})
    category:Types.ObjectId

}

export const PostSchema=SchemaFactory.createForClass(Post)
