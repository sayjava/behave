const express = require('express');
const { behaveHandler } = require('@sayjava/behave');

const app = express();

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.render('index', {});
});

app.use("/api",behaveHandler({ config: { fromFile: 'behaviors.json' } }));

app.listen(8080, () => {
    console.info(`Weather site started on http://localhost:8080`);
});
