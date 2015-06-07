var $ = require('jquery');
var itemTpl = require('./templates/list-item.hbs');

function StoryListView (el, stories) {
    this.$el = el;
}

StoryListView.prototype.render = function(stories) {
    var html = '';
    items.forEach(function(item) {
        html += itemTpl(item);
    });
    this.$el.html(html);
};
