const createError = require('http-errors');
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sio = require('socket.io');
const indexRouter = require('./routes/index');
const ramdomN = require('./utils/randomNum');

const app = express();
const server = createServer(app);
const userIds = {};
const noop = () => {};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


function randomID(callback) {
  const id = ramdomN();
  if (id in userIds) setTimeout(() => ramdomN(callback), 5);
  else callback(id);
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
function sendTo(to, done, fail) {
  const receiver = userIds[to];
  if (receiver) {
    const next = typeof done === 'function' ? done : noop;
    next(receiver);
  } else {
    const next = typeof fail === 'function' ? fail : noop;
    next();
  }
}

function initSocket(socket) {
  let id;
  socket
    .on('init', () => {
      randomID((_id) => {
        id = _id;
        userIds[id] = socket;
        socket.emit('init', { id });
        console.log(id, 'connected');
      });
    })
    .on('request', (data) => {
      console.log('Request:', data);

      sendTo(data.to, to => to.emit('request', { from: id }));
    })
    .on('call', (data) => {
      console.log('Call:', data);

      sendTo(
        data.to,
        to => to.emit('call', { ...data, from: id }),
        () => socket.emit('failed'),
      );
    })
    .on('end', (data) => {
      sendTo(data.to, to => to.emit('end'));
    })
    .on('disconnect', () => {
      delete userIds[id];
      console.log(id, 'disconnected');
    });

  return socket;
}

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Listen on port ${port}`);
sio.listen(server, { log: true }).on('connection', initSocket);
