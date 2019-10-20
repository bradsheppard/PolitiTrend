import Politician from '../../entity/Politician';
import Repository from './Repository';

interface PoliticianRepository extends Repository<Politician> { }

export default PoliticianRepository;