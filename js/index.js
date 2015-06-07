'use strict';

var async = require('async');
var url = require('url');

var cache = require('./cache');



var myFirebaseRef = new Firebase("https://hacker-news.firebaseio.com/v0/");
var itemsContainer = document.querySelector('.items');

function render (ids) {

}

function createItem(item) {
    if (!item.url) {
        item.url = 'https://news.ycombinator.com/item?id=' + item.id;
    }

    item.host = url.parse(item.url).host;
    return item;
}

function getItem (id, cb) {
    cache.getItem('item:' + id, function(err, item) {
        if (item) {return cb(null, createItem(item))};

        myFirebaseRef.child('item/' + id).once('value', function(snapshot) {
            item = snapshot.val();
            cache.setItem('item:' + id, item);
            cb(null, createItem(item));
        });
    });
}



function getFromCache (cb) {
    cache.getItem('topstories', function(err, ids) {
        render(ids);
    });
}


function getFromAPI (cb) {
    myFirebaseRef.child('topstories').once('value', function(snapshot) {
        var ids = snapshot.val().slice(0, 30);
        cache.setItem('topstories', ids);

        async.map(ids, function(id, cb) {
            myFirebaseRef.child('item/' + id).once('value', function(snapshot) {
                item = snapshot.val();
                cache.setItem('item:' + id, item);
                cb(null, item);
            });
        }, function(err, items) {
            cb(null, items.map(createItem));
        });
    });
}

function render (err, stories) {
    // body...
}

getFromCache(render);
getFromAPI(render);
