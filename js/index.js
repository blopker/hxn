'use strict';

require('whatwg-fetch');
let page = require('page');

let views = require('./views');
let fb = require('./firebase');

let listView = new views.StoryListView('#container');
let commentView = new views.CommentView('#container');

let scrollPos = document.body.scrollTop;

page('/', function () {
    fb.getList(false, function (_, stories) {
        listView.render(stories);
        document.body.scrollTop = scrollPos;
    });
});

page('/comments/:id', function (ctx) {
    scrollPos = document.body.scrollTop;
    fb.getComment(ctx.params.id, function (_, comment) {
        commentView.render(comment);
        document.body.scrollTop = 0;
    });
});

page({
    hashbang: true,
    dispatch: false
});

fb.getList(true, (_, stories) => listView.render(stories));
