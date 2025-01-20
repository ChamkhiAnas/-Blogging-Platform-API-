import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';

@Module({

  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // Makes ConfigModule available throughout the app
    
    }),
    MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGO_URI'), // Get MONGO_URI from .env
    }),
    inject: [ConfigService],
    }),
    PostsModule,
    TagsModule,
    CategoriesModule,
    ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
