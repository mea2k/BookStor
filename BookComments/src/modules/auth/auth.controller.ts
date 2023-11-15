// eslint-disable-next-line prettier/prettier
import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { IUSerAuth } from './auth.interfaces';
import { IUSer } from '../users/users.interfaces';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';
import { UserAuthValidator } from './validators/userAuthValidator';

@Controller('api/users')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Post('signin')
	async signin(
		@Body(UserAuthValidator) item: IUSerAuth,
	): Promise<IUSer | null> {
		const user = await this.authService.signIn(item);
		if (user) {
			const { password, ...data } = user;
			return data;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Post('token')
	async getToken(@Body() item: IUSerAuth): Promise<string | null> {
		const user = await this.authService.signIn(item);
		if (user) {
			return this.authService.createToken(user);
		} else {
			throw new UnauthorizedException();
		}
	}
}
