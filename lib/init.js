const doc = document;
const print = console.log;
const F = window.devicePixelRatio || 1;

function selector(s) {
    return doc.querySelector(s);
}
function byID(s) {
    return doc.getElementById(s);
}

function isDesktopMode() {
    return window.innerWidth > screen.availWidth;
}