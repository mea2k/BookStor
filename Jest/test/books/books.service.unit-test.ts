import { Test, TestingModule } from '@nestjs/testing';
import { BooksModule } from '../../src/modules/books/books.module';
import { BooksController } from '../../src/modules/books/books.controller';
import { BooksService } from '../../src/modules/books/books.service';
import { UsersModule } from '../../src/modules/users/users.module';
import { BookStorageFile } from '../../src/modules/books/storage/bookStorageFile';
import { BOOKS_STORAGE, IBook } from '../../src/modules/books/books.interfaces';
import { USERS_STORAGE } from '../../src/modules/users/users.interfaces';
import { MyConfigModule } from '../../src/modules/config/config.module';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../src/modules/config/config.service';
import { UsersService } from '../../src/modules/users/users.service';

// заглушка для хранилища книг
const testBookStorage = {
	getAll: jest.fn(),
	get: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

// заглушка для хранилища пользователей
const testUserStorage = {
	getAll: jest.fn(),
	get: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

describe('BooksService', () => {
	let booksService: BooksService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [MyConfigModule],
			providers: [
				BooksService,
				// ConfigService,
				UsersService,
				AuthService,
				JwtService,
				{
					useValue: testBookStorage,
					provide: BOOKS_STORAGE,
				},
				{
					useValue: testUserStorage,
					provide: USERS_STORAGE,
				},
			],
		})
			//.overrideProvider(BookStorageFile)
			//.useValue(testBookStorage)
			.compile();

		booksService = moduleRef.get<BooksService>(BooksService);
	});

	it('should have the service defined', () => {
		expect(booksService).toBeDefined();
	});

	it('should call the database', () => {
		booksService.getAll();
		expect(testBookStorage.getAll).toHaveBeenCalled();
	});

	describe('GetAll', () => {
		it('should return an array of Books of type IBook[]', async () => {
			const result: Array<IBook> = [];
			jest.spyOn(testBookStorage, 'getAll').mockImplementation(() =>
				Promise.resolve(result),
			);

			expect(await booksService.getAll()).toBe(result);
			expect(testBookStorage.getAll).toHaveBeenCalled();
		});
	});
});

// describe('#getAll', () => {
// 	beforeEach(() => {
// 		jest.spyOn(mockDataBaseService, 'getAll');
// 	});

// 	it('should be defined', () => {
// 		expect(service.getAll).toBeDefined();
// 	});

// 	it('should call the database', () => {
// 		service.getAll();
// 		expect(mockDataBaseService.getAll).toBeCalledTimes(1);
// 	});
// });

// describe('#get', () => {
// 	beforeEach(() => {
// 		jest.spyOn(mockDataBaseService, 'get');
// 	});

// 	it('should be defined', () => {
// 		expect(service.get).toBeDefined();
// 	});

// 	it('should call the database', () => {
// 		service.get('1');
// 		expect(mockDataBaseService.get).toBeCalledTimes(1);
// 	});
// });

// describe('#create', () => {
// 	beforeEach(() => {
// 		jest.spyOn(mockDataBaseService, 'create');
// 	});

// 	it('should be defined', () => {
// 		expect(service.create).toBeDefined();
// 	});

// 	it('should call the database', () => {
// 		service.create({} as ToDo);
// 		expect(mockDataBaseService.create).toBeCalledTimes(1);
// 	});
// });

// describe('#update', () => {
// 	beforeEach(() => {
// 		jest.spyOn(mockDataBaseService, 'update');
// 	});

// 	it('should be defined', () => {
// 		expect(service.update).toBeDefined();
// 	});

// 	it('should call the database', () => {
// 		service.update({} as ToDo);
// 		expect(mockDataBaseService.update).toBeCalledTimes(1);
// 	});
// });

// describe('#delete', () => {
// 	beforeEach(() => {
// 		jest.spyOn(mockDataBaseService, 'delete');
// 	});

// 	it('should be defined', () => {
// 		expect(service.delete).toBeDefined();
// 	});

// 	it('should call the database', () => {
// 		service.delete('1');
// 		expect(mockDataBaseService.delete).toBeCalledTimes(1);
// 	});
// });

// describe('#markAsInActive', () => {
// 	beforeEach(() => {
// 		jest.spyOn(mockDataBaseService, 'get');
// 		jest.spyOn(mockDataBaseService, 'update');
// 	});

// 	it('should be defined', () => {
// 		expect(service.markAsInActive).toBeDefined();
// 	});

// 	describe('when inactive is called', () => {
// 		it('should call the databaseService.get', () => {
// 			expect(mockDataBaseService.get).toBeCalledTimes(1);
// 		});

// 		it('should call the databaseService.update', () => {
// 			expect(mockDataBaseService.update).toBeCalledTimes(1);
// 		});
// 	});
// });
//  });
