
/** ИНТЕРФЕЙС - КНИГА
 * Определяет информацию для каждого объекта КНИГА:
 *   _id:            number   - ID книги (обязательный параметр)
 *   title:         string   - название книги (обязательный параметр)
 *   description?:  string   - аннотация книги
 *   authors?:      string[] - авторы книги в виде массива строк
 *   fileCover?:    string   - имя файла с обложкой книги
 *   fileBook?:     string   - имя файла с содержимым книги
 * 
 * Обязательным является только поля ID и title
*/
export interface IBook /* extends Document */ {
    _id: number;
    title: string;
    description?: string;
    authors?: string[];
    fileCover?: string;
    fileBook?: string;
}


export interface IBookDto {
    title: IBook['title'];
    description?: IBook['description'];
    authors?: IBook['authors'];
    fileCover?: IBook['fileCover'];
    fileBook?: IBook['fileBook'];
}