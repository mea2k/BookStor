import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookCommentsService } from './bookcomments.service';
import { IBookComment, IBookCommentDto } from './bookcomments.interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';

@Controller('api/comments')
export class BookCommentsController {
	constructor(private readonly bookCommentService: BookCommentsService) {}

	@Get()
	async getAll(): Promise<IBookComment[]> {
		return this.bookCommentService.getAll();
	}

	@Get(':id')
	async getOne(@Param('id') id: string): Promise<IBookComment | null> {
		return this.bookCommentService.get(id);
	}

	@Get('/book/:id')
	async getByBook(@Param('id') id: string): Promise<IBookComment[] | null> {
		return this.bookCommentService.findAllBookComment(id);
	}

	@UseGuards(AuthGuard)
	@Post('/book/:id')
	async create(
		@Body() item: IBookCommentDto,
		@Req() request: Request,
		@Param('id', ParseIntPipe) id: number,
	): Promise<IBookComment | null> {
		const newItem = { ...item, bookId: id, user: request['user']._id };
		return this.bookCommentService.create(newItem);
	}

	@UseGuards(AuthGuard, OwnerGuard)
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() item: IBookCommentDto,
		@Req() request: Request,
	): Promise<IBookCommentDto | null> {
		const newItem: IBookCommentDto = { ...item, user: request['user']._id };
		return this.bookCommentService.update(id, newItem);
	}

	@UseGuards(AuthGuard, OwnerGuard)
	@Delete(':id')
	async delete(@Param('id') id: string): Promise<boolean> {
		return this.bookCommentService.delete(id);
	}
}
