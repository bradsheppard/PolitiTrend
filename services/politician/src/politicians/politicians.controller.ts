import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { PoliticiansService } from './politicians.service';
import Politician from './politicians.entity';
import { CreatePoliticianDto } from './dto/create-politician.dto';
import { SearchPoliticianDto } from './dto/search-politician.dto';
import { ResponseDto } from './dto/response.dto';

@Controller()
export class PoliticiansController {
	constructor(private politicianService: PoliticiansService) {}

	@Get()
	async getPoliticians(
		@Query() searchPoliticianDto: SearchPoliticianDto,
	): Promise<ResponseDto> {
		return await this.politicianService.get(searchPoliticianDto);
	}

	@Get(':id')
	async getPolitician(@Param('id') id: string): Promise<Politician> {
		const politician = await this.politicianService.getOne(
			parseInt(id, 10),
		);

		if (!politician) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return politician;
	}

	@Post()
	async insert(
		@Body() createPoliticianDto: CreatePoliticianDto,
	): Promise<Politician> {
		return await this.politicianService.insert(createPoliticianDto);
	}

	@Put(':id')
	async updatePolitician(
		@Param('id') id: string,
		@Body() createPoliticianDto: CreatePoliticianDto,
	): Promise<Politician> {
		const politician = await this.politicianService.update(
			parseInt(id, 10),
			createPoliticianDto,
		);

		if (!politician) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return politician;
	}
}
