'use strict';

const React = require('react');

const Stories = (stories) => {
    stories = stories.map(story =>{
        return <div className="list-item" key={story.id}>
            <a href={story.url}>
                <div className="story">
                    <h3>{story.title}</h3>
                    <div className="host">{story.displayURL}</div>
                </div>
            </a>
            <a href={`/comments/${story.id}`}>
                <aside>
                    <div className="comment-count">{story.descendants}</div>
                    <div className="score">{story.score}</div>
                </aside>
            </a>
        </div>
    });
    return <div>
        {stories}
    </div>;
}

module.exports = {
    Stories
};
