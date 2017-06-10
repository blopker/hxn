#!/usr/bin/env node
'use strict';

require('babel-register');

const crypto = require('crypto');
const express = require('express');
const api = require('./api');
const logger = require('morgan');
const path = require('path');

const { baseTpl } = require('./views/base');

const app = express();
api.init();

const DEBUG = app.get('env') === 'development';
function randomValueBase64 (len) {
  if (DEBUG) { return 'RANDOM'; }
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')
    .slice(0, len)
    .replace(/\+/g, '0')
    .replace(/\//g, '0');
}
const STATIC_BASE = `/static-${randomValueBase64(10)}`;

function render(content, title) {
  return baseTpl(content, title, STATIC_BASE);
}

app.use(logger('dev'));

const staticOps = {
  maxAge: DEBUG ? 0 : '360d'
};

app.use(STATIC_BASE,
  express.static(path.join(__dirname, 'public'), staticOps));

app.use((req, res, next) => {
  res.locals.STATIC_BASE = STATIC_BASE;
  next();
});

app.get('/', (req, res) => {
  const stories = api.getStories();
  res.send(render(stories, 'Stories'));
});

app.get('/comments/:id', (req, res, next) => {
  const comment = api.getComment(req.params.id)
  if (!comment) { return next(); }
  res.send(render(comment, comment.title));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (DEBUG) {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(Error);
});

const server = app.listen(process.env.PORT || '3000', () => {
  const host = server.address().address;
  const port = server.address().port;
  // eslint-disable-next-line no-console
  console.log('Listening at http://%s:%s', host, port);
});
