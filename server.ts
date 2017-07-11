import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as Datastore from "nedb";
import { TelemetryRoute } from "./routes/telemetry";

export class Server {

    public app: express.Application;
    private db: any;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }

    public api() {
        //empty for now
    }

    public config() {
        // static content path
        this.app.use(express.static(path.join(__dirname,'public')));

        // body-parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // json display formatting
        this.app.set('json spaces', 2);

        // database
        this.db = new Datastore({ filename: 'data/db/telemetry.db' });
        this.db.loadDatabase((err) => {
            if (err) {
                console.log("There was an error loading database.");
            } else {
                this.app.listen(3000, () => {
                    console.log("Listening on 3000");
                })
            }
        })
    }

    public routes() {
        let router: express.Router;
        router = express.Router();
        TelemetryRoute.create(router,this.db);
        this.app.use(router);
    }

}