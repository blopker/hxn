'use strict';

let Firebase = require('firebase');
let url = require('url');
let _ = require('lodash');

let fire = new Firebase('https://hacker-news.firebaseio.com/v0/');

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
        }, 2000);
        fire.child(`item/${id}`).once('value', snap => {
            let newItem = snap.val();
            res(createItem(newItem));
        });
    });
}

function getComment(commentID) {
    return getItem(commentID).then(comment => {
        let kids = comment.kids || [];
        return Promise.all(kids.map(getComment)).then(k => {
            comment.kids = k;
            return comment;
        });
    });
}

function getList () {
    let p = new Promise(res => {
        fire.child('topstories').once('value', snap => {
            res(snap.val().slice(0, 30));
        });
    });

    return p.then(ids => {
        return Promise.all(ids.map(getItem));
    }).then(items => {
        return items.filter(i => !_.isEmpty(i));
    });
}

module.exports = {
    getList: getList,
    getComment: getComment
};
