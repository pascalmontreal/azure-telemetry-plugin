"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var Datastore = require("nedb");
var telemetry_1 = require("./routes/telemetry");
var Server = (function () {
    function Server() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.api = function () {
        //empty for now
    };
    Server.prototype.config = function () {
        var _this = this;
        // static content path
        this.app.use(express.static(path.join(__dirname, 'public')));
        // body-parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        // json display formatting
        this.app.set('json spaces', 2);
        // database
        this.db = new Datastore({ filename: 'data/db/telemetry.db' });
        this.db.loadDatabase(function (err) {
            if (err) {
                console.log("There was an error loading database.");
            }
            else {
                _this.app.listen(3000, function () {
                    console.log("Listening on 3000");
                });
            }
        });
    };
    Server.prototype.routes = function () {
        var router;
        router = express.Router();
        telemetry_1.TelemetryRoute.create(router, this.db);
        this.app.use(router);
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map