'use strict';
(function() {
    document.addEventListener('click', function(e) {
        const comment = e.target.closest('.js-comment');
        if (comment) {
            comment.classList.toggle('collapse');
        }
    });
})()
