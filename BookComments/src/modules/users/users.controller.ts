// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Delete, Param, ParseIntPipe, Body, UseGuards, Request } from '@nestjs/common';
import { IUSer, IUSerDto } from './users.interfaces';
import { UsersService } from './users.service';
import { UsersDtoValidator } from './validators/usersDtoValidator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Get(':id')
	async getOne(@Param('id', ParseIntPipe) id: number): Promise<IUSer | null> {
		return this.usersService.get(id);
	}

	@Post('signup')
	async create(
		@Body(UsersDtoValidator) item: IUSerDto,
	): Promise<IUSer | null> {
		return this.usersService.create(item);
	}

	// используем стандартный валидатор ParseIntPipe
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
		return this.usersService.delete(id);
	}
}
