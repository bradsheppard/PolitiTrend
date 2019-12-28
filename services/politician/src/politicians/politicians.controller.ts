import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PoliticiansService } from './politicians.service';
import Politician from './politicians.entity';
import { CreatePoliticianDto } from './dto/create-politician.dto';

@Controller()
export class PoliticiansController {
	constructor(private politicianService: PoliticiansService) {}

	@Get()
	async getPoliticians(): Promise<Politician[]> {
		return await this.politicianService.get();
	}

	@Get(':id')
	async getPolitician(@Param('id') id: string) {
		return await this.politicianService.getOne(parseInt(id, 10));
	}

	@Post()
	async insert(@Body() createPoliticianDto: CreatePoliticianDto) {
		const politician: Politician = {
			id: createPoliticianDto.id,
			name: createPoliticianDto.name,
			party: createPoliticianDto.party,
			sentiment: 0,
		};
		await this.politicianService.insert(politician);
	}
}
