// import "./scss/index.scss";
import "./assets/scss/reset.scss";
import "./assets/scss/index.scss";

import { a, b } from './assets/js/utils.js'

var app = document.getElementById('box')
app.innerHTML = '<div class="big-box">12121222</div>'

console.log(a())
console.log(b())

$('div').addClass('new')

$.get('/api/comments/show', {
    id: '4193586758833502',
    page: 1
}, function (data) {
    $('body').append(`<div>${JSON.stringify(data)}</div>`)
})