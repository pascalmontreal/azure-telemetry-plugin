import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";


/**
 * /telemetry route
 *
 * @class TelemetryRoute
 */
export class TelemetryRoute extends BaseRoute {
  private db:any;

  public static create(router: Router, db: any) {
    router.get("/telemetry", (req: Request, res: Response, next: NextFunction) => {
      new TelemetryRoute(db).getAll(req, res, next);
    });
    router.post("/telemetry", (req: Request, res: Response, next: NextFunction) => {
      new TelemetryRoute(db).add(req, res, next);
    });
    router.delete("/telemetry", (req: Request, res: Response, next: NextFunction) => {
      new TelemetryRoute(db).delete(req, res, next);
    });

  }

  constructor(db:any) {
    super();
    this.db = db;
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
	this.db.find({}).sort({timestamp:1}).exec(function(err, docs){
		if (err) {
			res.status(500).end() // internal server error
		} else {
			res.setHeader('Content-Type', 'application/json')
			res.json(docs)
			res.status(200)
			res.end()
		}
	})
  }

    public add(req: Request, res: Response, next: NextFunction) {
        if (req.body){
            this.db.insert(req.body, function(err, newDocs){
                if (err) {
                    console.log(err)
                    res.status(400).end() // bad request
                }
                else res.status(201).end() // created
            })
        } else {
            res.status(204).end() // no content
        }
        res.status(201).end()
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        this.db.remove({}, { multi: true }, function (err, numRemoved) {
            if (err) {
                res.status(500).end() // internal server error
            } else {
                res.status(200).end() // ok
            }
        })
    }

}