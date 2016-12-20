var express         = require('express');
var router          = express.Router();
var _               = require('lodash');
var fs              = require("fs");
var path            = require('path');
var contents        = fs.readFileSync("./users.json");
var users           = JSON.parse(contents);
var userCounter     = 0;
var passwordCounter = 0;
var start           = new Date();

/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription This API returns list of all the normal users along with one-liner of their access level.
 *
 * @apiPermission none
 */
router.get('/users', function (req, res, next) {
    userCounter++;
    res.status(200).json(users);
});

/**
 * @api {get} /user Throw error for no user
 * @apiName GetUserDetail
 * @apiGroup Password
 * @apiVersion 1.0.0
 * @apiDescription Throws error if username is not provided
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 *
 *  @apiPermission none
 */
router.get('/user', function (req, res, next) {
    userCounter++;
    var query = req.query;
    console.log(query);

    var result = _.find(users, query);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).json({"error" : "No Results Found!"});
    }


});

// Hidden easter egg
router.get('/counter', function (req, res, next) {
    console.log('start time is: ' + start);
    res.json({"UserCounter": userCounter, "PasswordCounter": passwordCounter, "processStartedOn": "" + start});
});

module.exports = router;
