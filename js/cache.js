'use strict';

var StorageLRU = require('storage-lru').StorageLRU;
var asyncify = require('storage-lru').asyncify;
var lru = new StorageLRU(asyncify(localStorage));

var opts = {json: true, cacheControl: 'max-age=1200'};

module.exports = {
	'setItem': function(key, value, cb) {
		lru.setItem(key, value, opts, cb);
	},
    'getItem': function(key, cb) {
        lru.getItem(key, opts, cb);
    },
    'removeItem': lru.removeItem.bind(lru),
    'keys': lru.keys.bind(lru)
};
