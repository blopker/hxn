var StorageLRU = require('storage-lru').StorageLRU;
var asyncify = require('storage-lru').asyncify;
var lru = new StorageLRU(asyncify(localStorage));



module.exports = {
	'setItem': function(key, value, cb) {
		lru.setItem(key, value, {json: true, cacheControl:'max-age=300'}, cb);
	},
    'getItem': function(key, cb) {
        lru.getItem(key, {json: true, cacheControl:'max-age=300'}, cb);
    },
    'removeItem': lru.removeItem.bind(lru),
    'keys': lru.keys.bind(lru),
};
