import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: process.env.CONFIG_FILE || '.env',
		}),
	],
	controllers: [ConfigController],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class MyConfigModule {}
