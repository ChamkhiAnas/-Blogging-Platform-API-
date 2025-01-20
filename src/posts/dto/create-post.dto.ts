import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { CreateCategoryDto } from "src/categories/dto/create-category.dto";
import { CreateTagDto } from "src/tags/dto/create-tag.dto";

export class CreatePostDto {

    @IsString()
    title:string;

    @IsString()
    content:string;

    @IsArray()
    @IsString({ each: true })
    tags:string[]


    @IsString()
    category:string

}
