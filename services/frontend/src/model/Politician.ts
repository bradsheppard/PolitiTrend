import Opinion from './Opinion';

interface Politician {
    id: number;
    name: string;
    sentiment: number;
    party: string;
    opinions: Opinion[];
}

export default Politician;
