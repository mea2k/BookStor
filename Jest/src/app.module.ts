import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MyConfigModule } from './modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';

@Module({
	imports: [BooksModule, UsersModule, MyConfigModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
