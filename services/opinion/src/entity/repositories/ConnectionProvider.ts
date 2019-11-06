import { Connection, createConnection } from 'typeorm';
import { injectable } from 'inversify';

@injectable()
class ConnectionProvider {
    private connection: Connection;

    public async getConnection(): Promise<Connection> {
        if (!this.connection)
            this.connection = await createConnection();

        return this.connection;
    }

}

export default ConnectionProvider;