// eslint-disable-next-line prettier/prettier
import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import { BooksService } from './books.service';
import { IBook, IBookDto } from './books.interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';

@Controller('api/books')
export class BooksController {
	constructor(private readonly bookService: BooksService) {}

	@Get()
	async getAll(): Promise<Array<IBook>> {
		return this.bookService.getAll();
	}

	@Get(':id')
	async getOne(@Param('id') id: string): Promise<IBook | null> {
		return this.bookService.get(id);
	}

	@UseGuards(AuthGuard)
	@Post()
	async create(
		@Body() item: IBookDto,
		@Req() request: Request,
	): Promise<IBook | null> {
		const newItem = { ...item, owner: request['user']._id };
		return this.bookService.create(newItem);
	}

	@UseGuards(AuthGuard, OwnerGuard)
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() item: IBookDto,
		@Req() request: Request,
	): Promise<IBook | null> {
		const newItem = { ...item, owner: request['user']._id };
		return this.bookService.update(id, item);
	}

	@UseGuards(AuthGuard, OwnerGuard)
	@Delete(':id')
	async delete(@Param('id') id: string): Promise<boolean> {
		return this.bookService.delete(id);
	}
}
