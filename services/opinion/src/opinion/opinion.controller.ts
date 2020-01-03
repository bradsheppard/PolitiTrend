import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { OpinionService } from './opinion.service';
import { CreateOpinionDto } from './dto/create-opinion.dto';
import { EventPattern } from '@nestjs/microservices';
import Opinion from './opinion.entity';

@Controller()
export class OpinionController {
	constructor(private opinionService: OpinionService) {}

	@Get()
	async findAll() {
		return await this.opinionService.get();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const opinion = await this.opinionService.getOne(parseInt(id, 10));

		if (!opinion) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return opinion;
	}

	@Post()
	async create(@Body() createOpinionDto: CreateOpinionDto): Promise<Opinion> {
		return await this.opinionService.insert(createOpinionDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const successful = await this.opinionService.deleteOne(parseInt(id, 10));

		if (!successful) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
	}

	@EventPattern('opinion_created')
	async handleOpinionCreated(createOpinionDto: CreateOpinionDto) {
		console.log('received');
		console.log(createOpinionDto);
		await this.opinionService.insert(createOpinionDto);
	}
}
