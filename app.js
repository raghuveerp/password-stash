var express      = require('express'),
    bodyParser   = require('body-parser'),
    logger       = require('morgan'),
    favicon      = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    sss          = require('simple-stats-server'),
    path         = require('path'),
    stats        = sss(),
    routes       = require('./routes/index'),
    app          = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', express.static(__dirname + '/docs'));
app.use('/api', routes);
app.use('/stats', stats);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err    = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
    });
});

module.exports = app;
