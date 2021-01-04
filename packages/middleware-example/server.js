const express = require('express');
const { behaveHandler } = require('@sayjava/behave');

const app = express();

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.use(behaveHandler({ config: { fromFile: 'behaviors.json' } }));

app.listen(3000, () => {
    console.info(`Weather ite started on 3000`);
});
