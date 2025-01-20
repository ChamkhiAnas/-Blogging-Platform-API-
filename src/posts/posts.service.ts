import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Tag } from 'src/tags/schemas/tag.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name) private postModel:Model<Post>,
    @InjectModel(Tag.name) private  tagModel:Model<Tag>,
    @InjectModel(Category.name) private categoryModel:Model<Category>,

  ){}

  async create(createPostDto: CreatePostDto) {
    const {tags,category,...post}=createPostDto

    //1) we look if category exist we bring its id if not we create it and retreive its id 
    const currentCategory=await this.categoryModel.findOne({
      name:category
    })

    let category_id;
    category_id= await currentCategory



    if(!currentCategory){
      const newCategory=await new this.categoryModel({"name":category})
      category_id=await newCategory.save()
    }


    //2) we look for each item in the tags array if exist we bring its id if not we create it and retreive its id 
    const tagIds:string[]=[]    

    const findedTags = await Promise.all(
      tags.map(async (tag)=>{
        const findedTag=await this.tagModel.findOne({"name":tag})
        if(!findedTag){
          const newTag=await new this.tagModel({"name":tag})
          const newTagId =  await newTag.save()
          return newTagId._id
        }
        return findedTag._id
      })
    );

    await findedTags



    //3) we create our post with the following id of findedtags
    const newPost=await new this.postModel({
      "title":post.title,
      "content":post.content,
      "category":category_id,
      "tags":findedTags
    })

    return newPost.save()



  }

  async findAll() {
    const posts=await  this.postModel.find()
    .populate({
      path: 'tags',
      model: 'Tag', 
      select: 'name -_id'
    })
    .populate({
      path: 'category',
      model: 'Category', 
      select: 'name -_id',
    })
    .exec()

    const result=await Promise.all(
      posts.map((post)=>{
        return {
          ...post.toObject(),
          tags: post.tags ? post.tags.map(tag => tag['name']): null,  
          category: post.category ? post.category['name'] : null,  // Extract the 'name' from category
      };
      })
    );

    return result;

  }

  async findOne(id: string) {
    const post=await this.postModel.findById(id)
    .populate({
      path: 'tags',
      model: 'Tag', 
      select: 'name -_id'
    })
    .populate({
      path: 'category',
      model: 'Category', 
      select: 'name -_id',
    })
    .exec()

    return {
          ...post.toObject(),
          tags: post.tags ? post.tags.map(tag => tag['name']): null,  
          category: post.category ? post.category['name'] : null,  // Extract the 'name' from category
      };
    
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    //1) check if post exist if doesnt return an error 
    const post=await this.postModel.findById(id)
    if(!post){
      throw new HttpException(`Post with the id ${id} doesnt exist`,HttpStatus.NOT_FOUND)
    }


    //2) check if category exist if not create it 
    const {tags,category,...currentPost}=await updatePostDto
    let category_id;
    let new_category_id;

    if(category){
      const currentCategory=await this.categoryModel.findOne({
        name:category
      })
  
      category_id= await currentCategory
  

      if(!currentCategory){
        const newCategory=await new this.categoryModel({"name":category})
        category_id=await newCategory.save()
      }
  
    }

    await updatePostDto.category ? new_category_id=category_id._id : new_category_id=post.category


    //3) check if tags are empty we dont change anything else we pull old tags and add new ones 
    let newPost;
    
    if(tags){
      
      const findedTags = await Promise.all(
        tags.map(async (tag)=>{
          const findedTag=await this.tagModel.findOne({"name":tag})
          if(!findedTag){
            const newTag=await new this.tagModel({"name":tag})
            const newTagId =  await newTag.save()
            return newTagId._id
          }
          return findedTag._id
        })
      );
  
      await findedTags
      


      await this.postModel.updateOne(
        { _id: post._id },
        { $pull: { tags: { $in: post.tags } } } // Use $in to remove multiple tags
      );

      newPost = await this.postModel.updateOne(
        { _id: post._id },
        { 
          $push: { tags: { $each: findedTags } }, // Use $each to push multiple tags
          $set: {
            category: new_category_id, // Update the category
            title: currentPost.title,  // Update the title
            content: currentPost.content // Update the content
          }
        }
      );

    }

    return newPost

  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
