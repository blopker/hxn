'use strict';

let Firebase = require('firebase');
let url = require('url');
let _ = require('lodash');
let thunk = require('thunkify');

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
getItem = thunk(getItem);

function * getComment(commentID) {
    let comment = yield getItem(commentID);
    comment.kids = comment.kids || [];
    comment.kids = yield comment.kids.map(getComment);
    return comment
}

function * createList(ids) {
    let items = yield ids.map(id => getItem(id));
    return items.filter(i => !_.isEmpty(i)).map(createItem);
}

function getStories (cb) {
    fire.child('topstories').once('value', function (snap) {
        let ids = snap.val().slice(0, 30);
        cb(null, ids);
    }, function(err) { cb(err); });
}

function * getList (cb) {
    let storyIDs = yield getStories;
    return yield createList(storyIDs);
}

module.exports = {
    getList: getList,
    getComment: getComment
};
