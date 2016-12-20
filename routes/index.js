var express         = require('express');
var router          = express.Router();
var _               = require('lodash');
var fs              = require("fs");
var path            = require('path');
var contents        = fs.readFileSync("./users.json");
var jsonContent     = JSON.parse(contents);
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
    var users = [];

    _.forEach(jsonContent, function (obj) {
        if (obj.active && !obj.admin) {
            users.push({"name": obj.name, "username": obj.username, "description": obj.description});
        }
    });

    res.json(users);
});

/**
 * @api {get} /password Throw error for no user
 * @apiName GetUserErrorHandler
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
router.get('/password', function (req, res, next) {
    res.status(404).json({"error": "username not found."});
});

/**
 * @api {get} /password/:user Get password for given user
 * @apiName GetPasswordForUser
 * @apiGroup Password
 * @apiVersion 1.0.0
 * @apiDescription This API returns the password of normal user or throws error for random user
 * @apiSuccess {String} password Password of the given user
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "password": "Password Text"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 *
 *  @apiPermission none
 */
router.get('/password/:user', function (req, res, next) {
    passwordCounter++;
    var user = req.params.user;

    if (user.match(/^:/)) {
        user = user.slice(1, user.length);
    }

    var userid = _.find(jsonContent, function (obj) {
        if (obj.active) {
            return obj.username === user ? obj : null;
        }
    });

    (!userid || userid.length == 0) ?
        res.status(404).json({"error": "UserNotFound"}) :
        res.json({"password": userid.password});
});

// Hidden easter egg
router.get('/counter', function (req, res, next) {
    console.log('start time is: ' + start);
    res.json({"UserCounter": userCounter, "PasswordCounter": passwordCounter, "processStartedOn": "" + start});
});

/**
 * @api {get} /passwords Get all Passwords
 * @apiName GetAllPasswords
 * @apiGroup Password
 * @apiVersion 1.0.0
 * @apiDescription Gets all the username/passwords combinations in one go
 * @apiPermission none
 */
router.get('/passwords', function (req, res, next) {
    passwordCounter++;
    var users = [];

    _.forEach(jsonContent, function (obj) {
        if (obj.active) {
            users.push({"username": obj.username, "password": obj.password});
        }
    });

    res.json(users);
});

module.exports = router;
