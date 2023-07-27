import { Container } from "inversify";
import { BookModel } from "./books/bookModel";
import { BookStorageDb } from "./books/bookStorageDb";
import { BookStorageFile } from "./books/bookStorageFile";

const iocContainer = new Container();

// interface BookStorageFileConstructor {
//     new(factor: number, count: number): Question;
// }

// interface BookStorageDbConstructor {
//     new(factor: number, count: number): Question;
// }


// ioccontainer.bind<QuestionConstructor>("QuestionConstructor").toConstructor(Question);

//     container.bind<ProblemFactory>("ProblemFactory").toFactory<Problem>((context) => {
//         return (factor: number, count: number) => {
//             const Constructor =  context.container.get<QuestionConstructor>("QuestionConstructor");
//             return new Constructor(factor, count);
//         };
//     });


iocContainer.bind(BookStorageDb).toSelf().inSingletonScope();
iocContainer.bind(BookStorageFile).toSelf().inSingletonScope();
iocContainer.bind(BookModel).toSelf();

export { iocContainer };