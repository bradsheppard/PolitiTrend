import Repository from './Repository';
import Job from '../Job';

interface JobRepository extends Repository<Job> {}

export default JobRepository;