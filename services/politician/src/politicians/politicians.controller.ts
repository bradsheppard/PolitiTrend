import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
		return await this.politicianService.getOne(parseInt(id, 10));
	}

	@Post()
	async insert(@Body() createPoliticianDto: CreatePoliticianDto): Promise<Politician> {
		return await this.politicianService.insert(createPoliticianDto);
	}
}
