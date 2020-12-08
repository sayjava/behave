const express = require("express");
const { expressMiddleware } =  require("@sayjava/behave");

const app = express();
// app.set("views", "./views");
// app.set('view engine', 'html')

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

expressMiddleware(app, { fromFile: "behaviors.json" });

app.listen(3000, () => {
  console.info(`Weather ite started on 3000`);
});
