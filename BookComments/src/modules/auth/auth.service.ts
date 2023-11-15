import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUSerAuth } from './auth.interfaces';
import { IUSer } from '../users/users.interfaces';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) { }

	async signIn(userAuth: IUSerAuth): Promise<IUSer> {
		const user = await this.usersService.getByLogin(userAuth.login);
		if (user?.password !== userAuth.password) {
			throw new UnauthorizedException();
		}

		const { password, ...result } = user;
		return result;
	}

	createToken(user: IUSer): string {
		// убираем пароль из JWT
		let data = {};
		if (user?.password) {
			const { password, ...restData } = user;
			data = restData;
		} else {
			data = user;
		}
		return this.jwtService.sign(data, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_EXPIRE'),
		});
	}

	async validateUser(user: IUSer): Promise<any> {
		const data = await this.usersService.get(user?._id);
		if (data) {
			return user;
		}
		return null;
	}
}
