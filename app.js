var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


//Conexion con la base de datos
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'mydb'
});

//app.set('view engine', 'HTML');


app.get('/', function(req, res){
  res.sendFile('landing.html', {root: __dirname + '/public/main'});
});

app.get('/tickets', function(req, res){
  connection.query('call get_all_by_ticket()', function (err, rows, fields) {
    if (err) {
      res.status(500).send();
      console.log(err);
    } else  {
      res.json(rows[0]);
    }
  });
});

app.get('/tickets_average_day', function(req, res){
  connection.query('call average_by_day()', function (err, rows, fields) {
    if (err) {
      res.status(500).send();
      console.log(err);
    } else  {
      res.json(rows[0]);
    }
  });
});

app.get('/tickets_average_amount', function(req, res){
  connection.query('call average_amount_by_ticket()', function (err, rows, fields) {
    if (err) {
      res.status(500).send();
      console.log(err);
    } else  {
      res.json(rows[0]);
    }
  });
});

app.get('/tickets_average_items', function(req, res){
  connection.query('call average_items_per_ticket()', function (err, rows, fields) {
    if (err) {
      res.status(500).send();
      console.log(err);
    } else  {
      res.json(rows[0]);
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
