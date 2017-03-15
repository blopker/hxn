'use strict';

const firebase = require('firebase');
const url = require('url');
const _ = require('lodash');
const comments = require('lru-cache')(5000);
let stories = [];

const config = {
  databaseURL: 'https://hacker-news.firebaseio.com'
};
firebase.initializeApp(config);
const fire = firebase.database().ref('/v0/');

function createItem(item) {
    if (!item) { return {}; }
    if (!item.url) {
        item.url = `https://news.ycombinator.com/item?id=${item.id}`;
    }
    item.host = url.parse(item.url).host;
    return item;
}

function getItem(id) {
    return new Promise(res => {
        setTimeout(() => {
            res({});
        }, 10000);
        fire.child(`item/${id}`).once('value', snap => {
            const newItem = snap.val();
            res(createItem(newItem));
        });
    });
}

function updateComment(commentID) {
    return getItem(commentID).then(comment => {
        const kidIDs = comment.kids || [];
        const futureKids = kidIDs.map(updateComment);
        return Promise.all(futureKids).then(k => {
            comment.kids = k.filter(k => k.text);
            return comment;
        });
    });
}

function init() {
    fire.child('topstories').limitToFirst(30).on('value', snap => {
        Promise.all(snap.val().map(getItem)).then(items => {
           return items.filter(i => !_.isEmpty(i));
        }).then(items => {
            stories = items;
            return Promise.all(items.map(i => i.id).map(updateComment));
        }).then(items => {
            items.map(i => {
                comments.set(String(i.id), i);
            });
        });
    });
}

module.exports = {
    init,
    getStories: () => stories,
    getComment: id => comments.get(id)
};
