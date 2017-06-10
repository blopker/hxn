'use strict';

function baseTpl(content, title, static_base) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>HXN - ${title}</title>
    <link rel="icon" href="${static_base}/favicon.ico" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <link rel="stylesheet" href="${static_base}/css/style.css" />
</head>
    <body>
        <a href="/">
            <header>
                <div class="header-title">
                    <h3>HXN</h3>
                </div>
            </header>
        </a>
        <div id="container" class="items">
            ${content}
        </div>
        <footer>
            Yolo'd by blopker. <a href="https://github.com/blopker/HXN">Source</a>.
        </footer>
        <script src="${static_base}/js/main.js"></script>
    </body>
</html>`;
}


module.exports = {
    baseTpl
};
