#!/usr/bin/env node
var newrelic = require('newrelic');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fb = require('./firebase');
var nunjucks = require('nunjucks');

var app = express();

var DEBUG = app.get('env') === 'development';

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.locals.newrelic = newrelic;

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

app.use(logger('dev'));

var staticOps = {
  maxAge: DEBUG ? 0 : '1d'
};

app.use(express.static(path.join(__dirname, 'public'), staticOps));

// New Relic middleware
app.use(function(req, res, next) {
  res.locals.timingHeader = newrelic.getBrowserTimingHeader();
  next();
});

app.get('/', function (req, res) {
  fb.getList(function (_, stories) {
    res.render('list.html', {stories: stories});
  });
});

app.get('/comments/:id', function (req, res, next) {
  fb.getComment(req.params.id, function (_, comment) {
    if (!comment.id) { next(); }
    res.render('comments.html', {comment: comment});
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
