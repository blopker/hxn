'use strict';

var itemTpl = require('./templates/list-item.hbs');

function StoryListView (el) {
    this.$el = window.document.querySelector(el);
}

StoryListView.prototype.render = function(stories) {
    var html = '';
    stories.forEach(function(item) {
        html += itemTpl(item);
    });
    this.$el.innerHTML = html;
};

exports.StoryListView = StoryListView;
