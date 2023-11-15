import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: process.env.CONFIG_FILE || '.env',
			isGlobal: true,
		}),
	],
	controllers: [ConfigController],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class MyConfigModule { }
