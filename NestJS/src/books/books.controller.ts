// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { IBook, IBookDto } from './interfaces/book';

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

	@Post()
	async create(@Body() item: IBookDto): Promise<IBook | null> {
		return this.bookService.create(item);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() item: IBookDto,
	): Promise<IBook | null> {
		return this.bookService.update(id, item);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<boolean> {
		return this.bookService.delete(id);
	}
}
