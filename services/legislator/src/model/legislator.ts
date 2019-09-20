import { Column, Model, Table } from 'sequelize-typescript';

@Table
class Legislator extends Model<Legislator> {
    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    age: number;
}

export default Legislator;