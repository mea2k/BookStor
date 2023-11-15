// eslint-disable-next-line prettier/prettier
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BookCommentsService } from './bookcomments.service';
import { IBookComment, IBookCommentDto } from './bookcomments.interfaces';

@WebSocketGateway({ cors: true })
export class BookCommentsGateway {
	constructor(private readonly bookCommentService: BookCommentsService) { }
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('ping')
	handlePingMessage(client: any, payload: any): string {
		console.log(this.server.sockets);
		return 'pong';
	}

	@SubscribeMessage('getBookComments')
	handleGetBookCommentsMessage(
		@MessageBody() bookId: string,
		@ConnectedSocket() client: Socket
	): Promise<IBookComment[]> {
		return this.bookCommentService.findAllBookComment(bookId);
	}

	@SubscribeMessage('newBookComment')
	handleNewBookCommentMessage(
		@MessageBody() data: IBookCommentDto,
		@ConnectedSocket() client: Socket
	): string {
		// отправляем всем, включая автора сообщения
		this.server.emit('newBookComment', data);
		return 'OK';
	};
}
