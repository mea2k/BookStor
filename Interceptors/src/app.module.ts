import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './modules/books/books.module';
import { MyConfigModule } from './modules/config/config.module';

@Module({
	imports: [MyConfigModule, BooksModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
