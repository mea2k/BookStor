import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';
import * as Joi from 'joi';

export const BooksDtoJoiSchema = Joi.object().keys({
	title: Joi.string().required(),
	authors: Joi.array<string>().optional(),
	description: Joi.string().optional(),
	fileBook: Joi.string().optional(),
	fileCover: Joi.string().optional(),
});

@Injectable()
export class BooksDtoJoiValidator implements PipeTransform {
	constructor(private schema: Joi.ObjectSchema) {}

	transform(value: any, metadata: ArgumentMetadata) {
		const { error } = this.schema.validate(value);
		if (error) {
			throw new BadRequestException('Validation failed');
		}
		return value;
	}
}
