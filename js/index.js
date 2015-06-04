var async = require('async');
var itemTpl = require('./templates/list-item.hbs');

var myFirebaseRef = new Firebase("https://hacker-news.firebaseio.com/v0/");
var itemsContainer = document.querySelector('.items');

function display (snapshot) {
	var top = snapshot.val().slice(0, 30);
	async.map(top, getItem, function(err, items) {
		items.forEach(function(item) {
			itemsContainer.innerHTML += itemTpl(item);
		});
	});
}

function getItem (id, cb) {
	myFirebaseRef.child("item/" + id).once("value", function(snapshot) {
		cb(null, snapshot.val());
	});
}

myFirebaseRef.child("topstories").once("value", display);
