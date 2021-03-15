import Politician from '../politicians.entity';

interface Meta {
	count: number;
}

export class ResponseDto {
	data: Politician[];
	meta: Meta;
}
