var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const pools = mysql.createPool({
  host:"localhost",
  user:"root",
  password:"",
  database:"AW_24",
  port: 3306
});

const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
  host:"localhost",
  user:"root",
  password:"",
  database:"AW_24",
  port: 3306,
  expiration: 3600000
});

app.use(session({
  secret: 'viajaja',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 3600000 // 1 hora en milisegundos para la cookie
  }
}));

const DAOUsuarios = require('./DAOUsuarios')
const DAOSesiones = require('./DAOSesiones');
const DAOEventos = require("./DAOEventos");

const daoSesiones = new DAOSesiones(pools);
const daoUsuarios = new DAOUsuarios(pools);
const daoEventos = new DAOEventos(pools);


app.use((request, response, next) =>{
  request.daoSesiones = daoSesiones;
  request.daoUsuarios = daoUsuarios;
  request.daoEventos = daoEventos;
  next();
});

app.use((req, res, next) => {
  console.log("Contenido de la sesión:", req.session);
  next();
});


var sesionRouter = require('./routes/sesion');
var usuariosRouter = require('./routes/usuarios');
var eventosRouter = require('./routes/eventos');

app.use('/', sesionRouter);
app.use('/usuarios', usuariosRouter);
app.use('/eventos', eventosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
