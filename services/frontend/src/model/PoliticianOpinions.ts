import Politician from './Politician';
import Opinion from './Opinion';

interface PoliticianOpinions {
    politician: Politician;
    opinions: Array<Opinion>
}

export default PoliticianOpinions