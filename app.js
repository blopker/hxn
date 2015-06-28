'use strict';

let express = require('express');
let path = require('path');
// let favicon = require('serve-favicon');
let logger = require('morgan');
let fb = require('./firebase');
let nunjucks = require('nunjucks');

let app = express();

const DEBUG = app.get('env') === 'development';

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));

let staticOps = {
    maxAge: DEBUG ? 0 : '1d'
};

app.use(express.static(path.join(__dirname, 'public'), staticOps));

app.get('/', function (req, res) {
    fb.getList(function (_, stories) {
        res.render('list.html', {stories: stories});
    });
});

app.get('/comments/:id', function (req, res, next) {
    function render(comment) {
        comment.children = comment.kids.map(function (c) {
            return render(c);
        });
        return nunjucks.render('comment.html', comment);
    }

    fb.getComment(req.params.id, function (_, comment) {
        if (!comment.id) { next(); }
        res.render('comments.html', {comment: render(comment)});
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (DEBUG) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(Error);
});

var server = app.listen(process.env.PORT || '3000', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
