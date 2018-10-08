// import "./scss/index.scss";
import "./assets/scss/reset.scss";
import "./assets/scss/index.scss";

import { a, b } from './assets/js/utils'
import { componentA } from './components/a'

var app = document.getElementById('one')
var list = componentA()
app.appendChild(list)

console.log(a())
console.log(b())

$('div').addClass('ne32')

$.get('/api/comments/show', {
    id: '4193586758833502',
    page: 1
}, function (data) {
    console.log(data)
    console.log(data)
    console.log(data)
    console.log(data)
})

if (module.hot) {
    module.hot.accept('./components/a', function () {
        app.removeChild(list)

        let ComponentA = require('./components/a').componentA
        let newlist = ComponentA()

        app.appendChild(newlist)
        list = newlist
    })
}