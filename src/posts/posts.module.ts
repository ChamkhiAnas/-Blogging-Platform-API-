import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post,PostSchema } from './schemas/post.schema';
import { Category,CategorySchema } from 'src/categories/schemas/category.schema';
import { Tag,TagSchema } from 'src/tags/schemas/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Category.name,
        schema:CategorySchema
      },
      {
        name:Tag.name,
        schema:TagSchema
      },
      {
        name:Post.name,
        schema:PostSchema
      },
    ])

  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
