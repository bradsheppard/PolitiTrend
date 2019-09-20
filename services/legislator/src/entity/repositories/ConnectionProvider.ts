import { Connection } from 'typeorm';

type ConnectionProvider = () => Promise<Connection>;

export default ConnectionProvider;