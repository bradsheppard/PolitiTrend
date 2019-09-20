import express from 'express';
import bodyParser from 'body-parser';

class App {

    private app: express.Application;
    private port: number;

    constructor(port: number = 8080) {
        this.app = express();
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers() {
        
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }
}

export default App;