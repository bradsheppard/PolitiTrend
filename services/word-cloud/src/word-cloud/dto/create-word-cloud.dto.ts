export class CreateWordCloudDto {
	politician: number;
	words: CreateWord[];
}

export class CreateWord {
	word: string;
	count: number;
}
