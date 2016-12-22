var express    = require('express'),
    bodyParser = require('body-parser'),
    fs         = require("fs"),
    contents   = fs.readFileSync("./users.json"),
    users      = JSON.parse(contents),
    _          = require('lodash'),
    router     = express.Router();


router.get('/users', function (req, res) {
    res.status(200).json(users);
});

router.get('/user', function (req, res) {
    var query = req.query;

    if (_.isEmpty(query)) {
        res.status(404).json({"error": "No Query Params found to filter results!"});
    } else {
        var result = _.find(users, query);
        (result) ? res.status(200).send(result) : res.status(404).json({"error": "No Results Found!"});
    }
});

router.get('/user/:username', function (req, res) {
    var username = req.params.username,
        result   = _.find(users, {"username": username});

    (result) ? res.status(200).send(result) : res.status(404).json({"error": "User " + username + " not found!"});

});

router.post('/user', bodyParser.json(), function (req, res) {
    console.log('Body is: ' + JSON.stringify(req.body));

    var username    = req.body.username,
        password    = req.body.password,
        name        = req.body.name,
        description = req.body.desription || 'User for some operation',
        active      = req.body.active || false;

    if (!username || !password || !name) {
        res.status(404).json({"error": "Please make sure you have provided username, password and name for the account"});
    }

    if (_.find(users, {"username": username})) {
        res.status(404).json({"error": username + " already exists. Please choose a different unique username."});
    } else {
        users.push({
            "username": username,
            "password": password,
            "name": name,
            "description": description,
            "active": active
        });

        fs.writeFileSync("./users.json", JSON.stringify(users, null, '\t'));
        res.end('username \"' + username + '\" created successfully.');
    }
});

router.put('/user/:username', bodyParser.json(), function (req, res) {
    var username = req.params.username,
        index    = _.findIndex(users, {"username": username}),
        newValue;

    if (!username) {
        res.status(404).json({"error": "username not found in the request."});
    }

    if (index && index >= 0) {
        newValue = {
            "username": username,
            "password": req.body.password || users[index].password,
            "name": req.body.name || users[index].name,
            "description": req.body.description || users[index].description,
            "active": req.body.active || users[index].active || false
        };

        users.splice(index, 1, newValue);
    } else {
        newValue = req.body;
        users.push(newValue)
    }

    fs.writeFileSync("./users.json", JSON.stringify(users, null, '\t'));
    res.end('username \"' + username + '\" updated successfully..');

});

router.put('/user', function (req, res) {

});

module.exports = router;
