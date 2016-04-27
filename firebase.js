'use strict';

let Firebase = require('firebase');
let async = require('async');
let url = require('url');
let _ = require('lodash');

let fire = new Firebase('https://hacker-news.firebaseio.com/v0/');

function createItem(item) {
    if (!item.url) {
        item.url = 'https://news.ycombinator.com/item?id=' + item.id;
    }
    item.host = url.parse(item.url).host;
    return item;
}

function getItem(id, cb) {
    cb = _.once(cb);
    setTimeout(function() {
        cb(null, {});
    }, 2000);
    fire.child('item/' + id).once('value', function (snap) {
        let newItem = snap.val();
        if (!newItem) { return cb(null, {}); }
        let item = createItem(newItem);
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
        items = items.filter(i => !_.isEmpty(i))
          .map(createItem);
        cb(null, items);
    });
}

function getList (cb) {
    fire.child('topstories').once('value', function (snap) {
        let ids = snap.val().slice(0, 30);
        createList(ids, cb);
    });
}

module.exports = {
    getList: getList,
    getComment: getComment
};
