var express    = require('express'),
    bodyParser = require('body-parser'),
    fs         = require("fs"),
    userFile   = './data/users.json',
    _          = require('lodash'),
    router     = express.Router();


var checkAllProperties = function (input) {
    var properties      = ['username', 'password', 'name', 'description', 'active'],
        inputProperties = [];

    for (var key in input) {
        if (input.hasOwnProperty(key)) {
            inputProperties.push(key);
        }
    }

    return _.isEqual(properties.sort(), inputProperties.sort());
};


router.get('/users', function (req, res) {
    var users = JSON.parse(fs.readFileSync(userFile));
    res.status(200).json(users);
});

router.get('/user/:username', function (req, res) {
    var username = req.params.username,
        users    = JSON.parse(fs.readFileSync(userFile)),
        result   = _.find(users, {"username": username});

    (result)
        ? res.status(200).send(result)
        : res.status(404).json({"error": "User " + username + " not found!"});

});

router.get('/user', function (req, res) {
    var query = req.query,
        users = JSON.parse(fs.readFileSync(userFile));

    if (_.isEmpty(query)) {
        res.status(404).json({"error": "No Query Params found to filter results!"});
    } else {
        var result = _.find(users, query);
        (result) ? res.status(200).send(result) : res.status(404).json({"error": "No Results Found!"});
    }
});

router.post('/user', bodyParser.json(), function (req, res) {
    var username    = req.body.username,
        password    = req.body.password,
        name        = req.body.name,
        description = req.body.desription || 'User for some operation',
        active      = req.body.active || false,
        users       = JSON.parse(fs.readFileSync(userFile));

    if (!username || !password || !name) {
        res.status(404).json({"error": "Please make sure you have provided mandatory fields"});
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

        fs.writeFileSync(userFile, JSON.stringify(users, null, '\t'));
        res.end('username \"' + username + '\" created successfully.');
    }
});

router.put('/user/:username', bodyParser.json(), function (req, res) {
    var username = req.params.username,
        users    = JSON.parse(fs.readFileSync(userFile)),
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
        if (checkAllProperties(req.body) && (req.body.username === username)) {
            newValue = req.body;
            users.push(newValue)
        } else {
            res.status(404).json({"error": "Please provide all the necessary fields."});
        }
    }

    fs.writeFileSync(userFile, JSON.stringify(users, null, '\t'));
    res.end('username \"' + username + '\" updated successfully..');

});

router.delete('/user/:username', function (req, res) {
    var username = req.params.username,
        users    = JSON.parse(fs.readFileSync(userFile));

    if (!username) {
        res.status(404).json({"error": "Please provide username to delete in the URL"});
    } else {
        users = _.reject(users, {"username": username});
        fs.writeFileSync(userFile, JSON.stringify(users, null, '\t'));
        res.end('Username: ' + username + ' deleted succussfully.');
    }
});

module.exports = router;
