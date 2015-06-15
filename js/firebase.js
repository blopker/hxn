'use strict';

let async = require('async');
let url = require('url');

let cache = require('./cache');

let fire = new Firebase('https://hacker-news.firebaseio.com/v0/');

const topstoriesURL = 'https://hacker-news.firebaseio.com/v0/topstories.json';

function createItem(item) {
    if (!item.url) {
        item.url = 'https://news.ycombinator.com/item?id=' + item.id;
    }

    item.host = url.parse(item.url).host;
    return item;
}

function getItem(id, cb) {
    cache.getItem('item:' + id, function (err, item) {
        if (item) { return cb(err, item); }
        fire.child('item/' + id).once('value', function (snap) {
            let newItem = snap.val();
            if (!newItem) { return cb(null, {}); }
            cache.setItem('item:' + id, newItem);
            cb(null, createItem(newItem));
        });
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

function getFromCache (cb) {
    cache.getItem('topstories', function(err, ids) {
        if (err) { return cb(err, []); }
        createList(ids, cb);
    });
}


function getFromAPI (cb) {
    fetch(topstoriesURL)
    .then(resp => resp.json())
    .then(function (json) {
        let ids = json.slice(0, 30);
        cache.setItem('topstories', ids);
        createList(ids, cb);
    });
}

module.exports = {
    getListAPI: getFromAPI,
    getListCache: getFromCache,
    // getItem: getItem,
    getComment: getComment
};
