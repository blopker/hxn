#!/usr/bin/env node
'use strict';

let newrelic = require('newrelic');
let crypto = require('crypto');
let koa = require('koa');
let logger = require('koa-logger');
let serve = require('koa-static-cache');
let mount = require('koa-mount');
let route = require('koa-route');
let nunjucks = require('koa-nunjucks-2')
let path = require('path');

let fb = require('./firebase');

function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')
        .slice(0, len)
        .replace(/\+/g, '0')
        .replace(/\//g, '0');
}

let app = koa();
let DEBUG = app.env === 'development';
app.use(logger());

app.context.render = nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    autoescape: true
  }
});

let STATIC_BASE = `/static-${randomValueBase64(10)}`;
let staticOps = {
  maxAge: DEBUG ? 0 : 31557600,
  dynamic: DEBUG,
  buffer: !DEBUG
};
app.use(mount(STATIC_BASE, serve('public', staticOps)));

// Handle errors
app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    yield this.render('error', {
      message: err.message,
      error: err
    });
  }
});

// catch 404 and forward to error handler
app.use(function *(next) {
  yield next
  if (404 != this.status) { return; }
  let err = new Error('Not Found');
  err.status = this.status;
  throw err;
});

// New Relic middleware
app.context.newrelic = newrelic;
app.use(function *(next) {
  this.state.timingHeader = newrelic.getBrowserTimingHeader();
  this.state.STATIC_BASE = STATIC_BASE;
  yield next;
});

app.use(route.get('/', function *() {
  let stories = yield fb.getList;
  yield this.render('list', {stories: stories});
}));

app.use(route.get('/comments/:id', function *(id, next) {
  let comment = yield fb.getComment(id);
  if (comment.id) {
    yield this.render('comments', {comment: comment});
  }
}));

let port = process.env.PORT || '3000'
let server = app.listen(port);
console.log('Listening at %s', port);
