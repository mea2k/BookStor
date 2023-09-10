// eslint-disable-next-line prettier/prettier
import {
	Body,
	Controller,
	UseInterceptors,
	Delete,
	Get,
	Param,
	Post,
	Put,
	ParseIntPipe,
	UsePipes,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { IBook, IBookDto } from './interfaces/book';
import { WrapperInterceptor } from 'src/interceptors/wrapper';
import { BooksDtoValidator } from './validators/booksDtoValidator';
import { BooksDtoJoiSchema, BooksDtoJoiValidator } from './validators/booksDtoJoiValidator';

@UseInterceptors(WrapperInterceptor)
@Controller('api/books')
export class BooksController {
	constructor(private readonly bookService: BooksService) {}

	@Get()
	async getAll(): Promise<Array<IBook>> {
		return this.bookService.getAll();
	}

	// используем стандартный валидатор ParseIntPipe
	@Get(':id')
	async getOne(@Param('id', ParseIntPipe) id: number): Promise<IBook | null> {
		return this.bookService.get(id);
	}

	// используем валидатор тела запроса (BooksDtoValidator)
	// и валидатор тела запроса Joi (BooksDtoJoiValidator)
	// для приведения к типу IBookDto
	@UsePipes(new BooksDtoJoiValidator(BooksDtoJoiSchema))
	@Post()
	async create(@Body() item: IBookDto): Promise<IBook | null> {
		return this.bookService.create(item);
	}

	// используем стандартный валидатор ParseIntPipe
	// для приведения к типу IBookDto
	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(BooksDtoValidator) item: IBookDto,
	): Promise<IBook | null> {
		return this.bookService.update(id, item);
	}

	// используем стандартный валидатор ParseIntPipe
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
		return this.bookService.delete(id);
	}
}
