'use strict';

require('whatwg-fetch');
let page = require('page');

let views = require('./views');
let fb = require('./firebase');

let listView = new views.StoryListView('#container');
let commentView = new views.CommentView('#container');

page('/', function () {
    fb.getListCache((_, stories) => listView.render(stories));
    fb.getListAPI((_, stories) => listView.render(stories));
});

page('/comments/:id', function (ctx) {
    fb.getComment(ctx.params.id, (_, comment) => commentView.render(comment));
});

page({
    hashbang: true
});
