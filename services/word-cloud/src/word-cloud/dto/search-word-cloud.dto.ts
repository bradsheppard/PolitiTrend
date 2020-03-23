import { IsInt} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchWordCloudDto {
	@IsInt()
	@Type(() => Number)
	politician?: number;

	@IsInt()
	@Type(() => Number)
	limit?: number;

	@IsInt()
	@Type(() => Number)
	offset?: number;
}
