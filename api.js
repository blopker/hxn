'use strict';

const firebase = require('firebase');
const url = require('url');
const _ = require('lodash');
const commentsCache = require('lru-cache')(5000);
const { Stories } = require('./views/list');
const { Comments } = require('./views/comments');
const ReactDOMServer = require('react-dom/server');

let storiesCache = [];

firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com'
});
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
            res(createItem(snap.val()));
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

async function updateComment(commentID) {
    let comment = await getItem(commentID);
    comment = cleanComment(comment);
    const kidIDs = comment.kids || [];
    const futureKids = kidIDs.map(updateComment);
    let kids = await Promise.all(futureKids);
    comment.kids = kids.filter(k => k.text).map(cleanComment);
    return comment;
}

function render(El, content) {
  return ReactDOMServer.renderToStaticMarkup(El(content));
}

async function updateStories(storyIDs) {
    let stories = await Promise.all(storyIDs.map(getItem));
    stories = stories.filter(i => !_.isEmpty(i));
    storiesCache = render(Stories, stories);
    let comments = await Promise.all(stories.map(i => i.id).map(updateComment));
    comments.forEach(i => {
        const html = render(Comments, i)
        commentsCache.set(String(i.id), html);
    });
}

function init() {
    fire.child('topstories').limitToFirst(30).on('value', snap => {
        updateStories(snap.val());
    });
}

module.exports = {
    init,
    getStories: () => storiesCache,
    getComment: id => commentsCache.get(id)
};
