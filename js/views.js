'use strict';

var itemTpl = require('./templates/list-item.hbs');
var commentTpl = require('./templates/comment.hbs');

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

function CommentView (el) {
    this.$el = window.document.querySelector(el);
}

CommentView.prototype.render = function(comment) {
    this.$el.innerHTML = this.renderHTML(comment);
};

CommentView.prototype.renderHTML = function(comment) {
    comment.children = comment.kids.map(c => this.renderHTML(c));
    return commentTpl(comment);
};

exports.StoryListView = StoryListView;
exports.CommentView = CommentView;
