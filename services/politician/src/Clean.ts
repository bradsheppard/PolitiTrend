import { container } from './inversify.config';
import { TYPES } from './types';
import PoliticianRepository from './entity/repositories/PoliticianRepository';

const politicianRepository: PoliticianRepository = container.get<PoliticianRepository>(TYPES.PoliticianRepository);

(async() => {
    await politicianRepository.delete();
})();