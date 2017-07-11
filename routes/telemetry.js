"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var route_1 = require("./route");
/**
 * /telemetry route
 *
 * @class TelemetryRoute
 */
var TelemetryRoute = (function (_super) {
    __extends(TelemetryRoute, _super);
    function TelemetryRoute(db) {
        var _this = _super.call(this) || this;
        _this.db = db;
        return _this;
    }
    TelemetryRoute.create = function (router, db) {
        router.get("/telemetry", function (req, res, next) {
            new TelemetryRoute(db).getAll(req, res, next);
        });
        router.post("/telemetry", function (req, res, next) {
            new TelemetryRoute(db).add(req, res, next);
        });
        router.delete("/telemetry", function (req, res, next) {
            new TelemetryRoute(db).delete(req, res, next);
        });
    };
    TelemetryRoute.prototype.getAll = function (req, res, next) {
        this.db.find({}).sort({ timestamp: 1 }).exec(function (err, docs) {
            if (err) {
                res.status(500).end(); // internal server error
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.json(docs);
                res.status(200);
                res.end();
            }
        });
    };
    TelemetryRoute.prototype.add = function (req, res, next) {
        if (req.body) {
            this.db.insert(req.body, function (err, newDocs) {
                if (err) {
                    console.log(err);
                    res.status(400).end(); // bad request
                }
                else
                    res.status(201).end(); // created
            });
        }
        else {
            res.status(204).end(); // no content
        }
        res.status(201).end();
    };
    TelemetryRoute.prototype.delete = function (req, res, next) {
        this.db.remove({}, { multi: true }, function (err, numRemoved) {
            if (err) {
                res.status(500).end(); // internal server error
            }
            else {
                res.status(200).end(); // ok
            }
        });
    };
    return TelemetryRoute;
}(route_1.BaseRoute));
exports.TelemetryRoute = TelemetryRoute;
//# sourceMappingURL=telemetry.js.map