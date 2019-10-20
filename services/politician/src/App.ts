import * as express from 'express';
import * as bodyParser from 'body-parser';
import Controller from './controllers/Controller';
import { injectable, multiInject } from 'inversify';
import { TYPES } from './types';

@injectable()
class App {

    public app: express.Application;
    private readonly port: number;

    constructor(
        @multiInject(TYPES.Controller) controllers: Array<Controller>
    ) {
        this.port = 8080;
        this.app = express();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((controller: Controller) => {
            this.app.use('/', controller.router);
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }
}

export default App;