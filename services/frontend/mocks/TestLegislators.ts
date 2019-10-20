import Legislator from '../model/Legislator';

const testLegislators: Array<Legislator> = [
    {
        name: 'Bernie Sanders',
        party: 'Independent',
        sentiment: 5
    },
    {
        name: 'Elizabeth Warren',
        party: 'Democratic',
        sentiment: 4
    },
    {
        name: 'Rand Paul',
        party: 'Republican',
        sentiment: 4
    },
    {
        name: 'Mitch McConnell',
        party: 'Republican',
        sentiment: -5
    },
    {
        name: 'Ted Cruz',
        party: 'Republican',
        sentiment: -4
    },
    {
        name: 'Joe Biden',
        party: 'Democratic',
        sentiment: -2
    },
    {
        name: 'Kamala Harris',
        party: 'Democratic',
        sentiment: -1
    },
    {
        name: 'Marco Rubio',
        party: 'Republican',
        sentiment: -2
    },
    {
        name: 'Andrew Yang',
        party: 'Democratic',
        sentiment: 4
    },
    {
        name: 'Mike Lee',
        party: 'Republican',
        sentiment: 2
    }
];

export default testLegislators;