import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ConfigModule } from './config/config.module';

@Module({
	imports: [ConfigModule, BooksModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
