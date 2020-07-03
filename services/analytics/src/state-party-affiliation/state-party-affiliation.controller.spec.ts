import { Test, TestingModule } from '@nestjs/testing';
import { StatePartyAffiliationController } from './state-party-affiliation.controller';
import { StatePartyAffiliationService } from './state-party-affiliation.service';
import { getModelToken } from '@nestjs/mongoose';
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';

describe('StatePartyAffiliation Controller', () => {
	let controller: StatePartyAffiliationController;
	let service: StatePartyAffiliationService;

	let id = 1;

	function createStatePartyAffiliation(): StatePartyAffiliation {
		id++;
		return {
			state: `State ${id}`,
			dateTime: new Date()
		} as StatePartyAffiliation;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StatePartyAffiliationController],
			providers: [
				StatePartyAffiliationService,
				{
					provide: getModelToken('StatePartyAffiliation'),
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<StatePartyAffiliationController>(StatePartyAffiliationController);
		service = module.get<StatePartyAffiliationService>(StatePartyAffiliationService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('Can get all', async () => {
		const statePartyAffiliation = createStatePartyAffiliation();
		jest.spyOn(service, 'findAll').mockResolvedValueOnce([statePartyAffiliation]);
		expect(await controller.findAll()).toEqual([statePartyAffiliation]);
	});

	it('Can handle state party affiliation created', async () => {
		const statePartyAffiliation = createStatePartyAffiliation();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.handleStatePartyAffiliationCreated(statePartyAffiliation);
		expect(insertSpy).toBeCalled();
	});
});
