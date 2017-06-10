'use strict';
const React = require('react');

function safe(text) {
    return {__html: text};
}

const Child = comment => {
    return <div key={comment.id} className="js-comment comment">
        <div className="js-author author">{comment.by}</div>
        <div className="text" dangerouslySetInnerHTML={safe(comment.text)}></div>
        {Children(comment.kids)}
    </div>
}

const Children = children => {
    if (!children.length) {
        return '';
    }
    return <div className="children">
        {children.map(c => Child(c))}
    </div>
}

const Comments = comment => {
    return <div>
        <div className="comment-header">
            <h3>{comment.title}</h3>
            <a href={comment.url}>{comment.url}</a>
            <div className="comment-header-author">By: {comment.by}</div>
            <div className="text" dangerouslySetInnerHTML={safe(comment.text)}></div>
        </div>
        <div className="comments">
            {comment.kids.map(c => Child(c))}
        </div>
    </div>
};

module.exports = {
    Comments
};
