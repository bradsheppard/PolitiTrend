import { IsInt, IsString } from 'class-validator';

export class CreateWordCloudDto {
	@IsInt()
	politician: number;

	words: CreateWord[];
}

export class CreateWord {
	@IsString()
	word: string;

	@IsInt()
	count: number;
}
