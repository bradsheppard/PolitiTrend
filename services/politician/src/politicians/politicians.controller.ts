import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { PoliticiansService } from './politicians.service';
import Politician, { Role } from './politicians.entity';
import { CreatePoliticianDto } from './dto/create-politician.dto';

@Controller()
export class PoliticiansController {
	constructor(private politicianService: PoliticiansService) {}

	@Get()
	async getPoliticians(): Promise<Politician[]> {
		return await this.politicianService.get();
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
