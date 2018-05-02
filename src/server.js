// server.js
const express = require("express");
const { h } = require("preact");
const render = require("preact-render-to-string");
import { Provider } from 'unistore/preact'
const { App } = require("./App");
const path = require("path");

import Router from './router'
import createStore from './store/store'

const app = express();

const HTMLShell = (html, state) => `
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css">
            <title> SSR Preact App </title>
        </head>
        <body>
            <div id="app">${html}</div>
            <script>window.__STATE__=${JSON.stringify(state).replace(/<|>/g, '')}</script>
            <script src="./app.js"></script>
        </body>
    </html>`

app.use(express.static(path.join(__dirname, "dist")));

app.get('**', (req, res) => {
    const store = createStore({ count: 0, todo: [] })

    let state = store.getState()

    let html = render(
        <Provider store={store}>
            <Router />
        </Provider>
    )

    res.writeHead(200 ,{'Content-Type': 'text/html'});
    res.end(HTMLShell(html, state));
})

app.listen(4000);