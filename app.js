var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var session = require('express-session');

var indexRouter = require('./routes/admin/index');
var usersRouter = require('./routes/users');
// var loginRouter = require('./routes/admin/login'); 
var adminRouter = require('./routes/admin/novedades');




var pool = require ('./modelos/bd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
  secret: 'nvrjuv',
  resave:false,
  saveUninitialized:true 
}));

secured = async (req, res, next)=>{
  try{
    console.log(req.session.id_usuario);
  
   
       if (req.session.id_usario) {
        next ();
        
      } else{
         res.redirect('/novedades');
      }
    
     } catch(error){
       console.log(error);
     }
   }

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/admin/login', loginRouter);
app.use('/admin/novedades',secured, adminRouter);


app.get('/', function(req, res){
  var conocido = Boolean (req.session.nombre);

  res.render('index',{
    tittle: 'Sesiones en Express Js',
    conocido: conocido,
    nombre: req.session.nombre
  });
});

app.post('/ingresar', function(req, res){
  if (req.body.nombre){
    req.session.nombre = req.body.nombre
  }
  
res.redirect ('/')
});


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
