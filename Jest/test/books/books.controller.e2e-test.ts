import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { BooksModule } from '../../src/modules/books/books.module';
import { BooksService } from '../../src/modules/books/books.service';
import { AuthGuard } from '../../src/modules/auth/auth.guard';
import { BooksOwnerGuard } from '../../src/modules/books/books.guard';

const URL = '/api/books/';

// заглушка для хранилища
const testBookService = {
	getAll: jest.fn(),
	get: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

// загушка для JWT-сервиса получения токена
const testJwtService = {
	sign: () => 'testJWT',
};

// заглушка для аутентификации
const testAuthGuard = {
	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		req.user = {
			login: 'test',
			_id: '1',
		};
		return true;
	},
};

// загушка для проверки владельца книги
const testBooksOwnerGuard = {
	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		req.user = {
			login: 'test',
			_id: '1',
		};
		return true;
	},
};

describe('BooksController', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [BooksModule],
		})
			.overrideProvider(BooksService)
			.useValue(testBookService)
			.overrideProvider(JwtService)
			.useValue(testJwtService)
			.overrideGuard(AuthGuard)
			.useValue(testAuthGuard)
			.overrideGuard(BooksOwnerGuard)
			.useValue(testBooksOwnerGuard)
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// тест на список книг
	describe('GET: books/', () => {
		beforeEach(() => {
			jest.spyOn(testBookService, 'getAll');
		});

		it('should return OK', async () => {
			await request(app.getHttpServer()).get(URL).expect(200, {});
		});
	});

	// тест на информацию по одной книге
	describe('GET: books/:id', () => {
		beforeEach(() => {
			jest.spyOn(testBookService, 'get');
		});

		it('should return OK', async () => {
			await request(app.getHttpServer())
				.get(URL + '1')
				.expect(200, {});
		});
	});

	// тест на создание книги
	// с авторизацией
	describe('POST: books', () => {
		beforeEach(() => {
			jest.spyOn(testBookService, 'create');
		});

		it('should return OK', async () => {
			await request(app.getHttpServer())
				.post(URL)
				.set('Authorization', `Bearer ${testJwtService.sign()}`)
				.expect(201, {});
		});
	});


	// тест на изменение книги
	describe('PUT: books/:id', () => {
		beforeEach(() => {
			jest.spyOn(testBookService, 'update');
		});

		it('should return OK', async () => {
			await request(app.getHttpServer())
				.put(URL + '1')
				.expect(200, {});
		});
	});


	// тест на удаление книги
	describe('DELETE: books/:id', () => {
		beforeEach(() => {
			jest.spyOn(testBookService, 'delete');
		});

		it('should return OK', async () => {
			await request(app.getHttpServer())
				.delete(URL + '1')
				.expect(200, {});
		});
	});
});
