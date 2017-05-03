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
    const parsedURL = url.parse(item.url);
    if (parsedURL.host === 'github.com') {
        item.displayURL = parsedURL.host + parsedURL.pathname;
    } else {
        item.displayURL = parsedURL.host;
    }
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

function closeTag(tag, text) {
    if(text.includes(`<${tag}>`) && !text.includes(`</${tag}>`)){
        text = text + `</${tag}>`;
    }
    return text;
}

function cleanComment(comment) {
    if (comment.text) {
        comment.text = closeTag('i', comment.text);
        comment.text = closeTag('p', comment.text);
    }
    return comment;
}

function updateComment(commentID) {
    return getItem(commentID).then(comment => {
        comment = cleanComment(comment);
        const kidIDs = comment.kids || [];
        const futureKids = kidIDs.map(updateComment);
        return Promise.all(futureKids).then(k => {
            comment.kids = k.filter(k => k.text);
            comment.kids = comment.kids.map(cleanComment);
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
