const apiURL = id => `http://hxn-api.kbl.io/?url=${id}`;
const itemURL = id => `https://news.ycombinator.com/item?id=${id}`;

function get(url, cb) {
    fetch(apiURL(url)).then(resp => resp.json())
        .then(json => cb(null, json))
        .catch(ex => cb(ex, {}));
}

module.exports = {
    get: get
};
