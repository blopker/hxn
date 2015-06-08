'use strict';

var async = require('async');
var url = require('url');

var cache = require('./cache');
var views = require('./views');

var myFirebaseRef = new Firebase('https://hacker-news.firebaseio.com/v0/');


function createItem(item) {
    if (!item.url) {
        item.url = 'https://news.ycombinator.com/item?id=' + item.id;
    }

    item.host = url.parse(item.url).host;
    return item;
}

function getFromCache (cb) {
    cache.getItem('topstories', function(err, ids) {
        if (err) { return cb(err, null); }
        async.map(ids, function(id, cb2) {
            cache.getItem('item:' + id, cb2);
        }, function(err2, items) {
            items = items.filter(function(item) { return item !== undefined; });
            cb(null, items.map(createItem));
        });
    });
}


function getFromAPI (cb) {
    myFirebaseRef.child('topstories').once('value', function(snapshot) {
        var ids = snapshot.val().slice(0, 30);
        cache.setItem('topstories', ids);

        async.map(ids, function(id, cb2) {
            myFirebaseRef.child('item/' + id).once('value', function(itemSnapshot) {
                var item = itemSnapshot.val();
                cache.setItem('item:' + id, item);
                cb2(null, item);
            });
        }, function(err, items) {
            cb(err, items.map(createItem));
        });
    });
}

var list = new views.StoryListView('.items');
function render (err, stories) {
    if (err) { return; }
    list.render(stories);
}

getFromCache(render);
getFromAPI(render);
