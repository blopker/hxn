'use strict';
(function() {
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('js-author')) { return; }
        const comment = e.target.closest('.js-comment');
        if (comment) {
            comment.classList.toggle('collapse');
        }
    });
})()
