'use strict';

var Firebase = require('firebase');
var async = require('async');
var url = require('url');

var fire = new Firebase('https://hacker-news.firebaseio.com/v0/');

function createItem(item) {
    if (!item.url) {
        item.url = 'https://news.ycombinator.com/item?id=' + item.id;
    }
    item.host = url.parse(item.url).host;
    return item;
}

function getItem(id, cb) {
    var to = setTimeout(function() {
        cb(null, {});
    }, 1000);
    fire.child('item/' + id).once('value', function (snap) {
        var newItem = snap.val();
        if (!newItem) { return cb(null, {}); }
        var item = createItem(newItem);
        clearTimeout(to);
        cb(null, item);
    });
}

function getComment(commentID, cb) {
    getItem(commentID, function (err1, comment) {
        comment.kids = comment.kids || [];
        async.map(comment.kids, getComment, function (err2, comments) {
            comment.kids = comments;
            cb(null, comment);
        });
    });
}

function createList(ids, cb) {
    async.map(ids, getItem, function(err2, items) {
        items = items.filter(function(item) { return item !== undefined; });
        items = items.filter(function(item) { return item !== null; });
        cb(null, items.map(createItem));
    });
}

function getList (cb) {
    fire.child('topstories').once('value', function (snap) {
        var ids = snap.val().slice(0, 30);
        createList(ids, cb);
    });
}

module.exports = {
    getList: getList,
    getComment: getComment
};
