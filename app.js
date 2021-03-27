require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var SessionMiddleware = require('./bin/Middlewares/SessionMiddleware.js')
var flash = require('connect-flash');


//routes 
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var chatRouter = require('./routes/chat');


//declare app
var app = express();

app.locals.basedir = path.join(__dirname, '/');
app.locals.baseUrl = process.env.APP_URL;


// helpers
let Helpers = require('./bin/helpers.js');
app.locals.$helpers = new Helpers(app);
// app.use((req, res, next) => {
// 	res.$helpers = new Helpers(app);
// 	return next();
// })


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//extensions
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(SessionMiddleware);

// usar flash()
app.use(flash());

app.use((req, res, next) => {
  
  let old = req.flash('old')[0] || [];
  
  res.locals.form_errors = req.flash('form_error');  
  res.locals.messages = req.flash('message');
  res.locals.old = old;
  
  next();

});


//sass middleware
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true, // true = .sass and false = .scss
	sourceMap: true
}));


//serve static files
app.use(express.static(path.join(__dirname, 'public')));


// routes usage
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);


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