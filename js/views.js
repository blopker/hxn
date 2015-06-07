'use strict';

var $ = require('jquery');
var itemTpl = require('./templates/list-item.hbs');

function StoryListView (el) {
    this.$el = $(el);
}

StoryListView.prototype.render = function(stories) {
    var html = '';
    stories.forEach(function(item) {
        html += itemTpl(item);
    });
    this.$el.html(html);
};

StoryListView.prototype.error = function(error) {
    this.$el.html(error);
};

exports.StoryListView = StoryListView;
