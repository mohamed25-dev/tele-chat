const auth = require('./middlewares/auth');
const User = require('./models/user');
const Message = require('./models/message');

const users = {};

io = require('socket.io')();

io.use(auth.socket);

io.on('connection', socket => {
  socketConnected(socket);
  socket.on('message', data => {
    onMessage(socket, data);
  });

  socket.on('disconnect', () => {
    onSocketDisconnected(socket);
  });

  socket.on('typing', (receiver) => {
    onTyping(socket, receiver);
  });

  socket.on('seen', (sender) => {
    onSeen(socket, sender);
  });

  initData(socket);
});

const onSeen = async (socket, sender) => {
  const receiver = socket.user._id;

  await Message.updateMany(
    {receiver, sender, seen: false}, 
    {seen: true},
    {multi: true}
  );


}

const onTyping = (socket, receiver) => {
  const sender = socket.user._id;
  socket.to(receiver).emit('typing', sender);
}

const socketConnected = (socket) => {
  console.log(`New Client Conntected, id => ${socket.id}`);
  socket.join(socket.user.id);
  
  users[socket.user._id] = true;
  const room = io.sockets.adapter.rooms[socket.user._id];
  if (!room || room.length === 1) {
    io.emit('user_status', {
      [socket.user._id]: true
    });
  }
}

const onSocketDisconnected = (socket) => {
  const room = io.sockets.adapter.rooms[socket.user._id];
  if (!room || room.length < 1) {
    const lastSeen = new Date().getTime();
    users[socket.user._id] = lastSeen;

    io.emit('user_status', {
      [socket.user._id]: lastSeen
    });
  }

  console.log(`Client Disconntected, id => ${socket.user.username}`);
}

const onMessage = async (socket, data) => {
  const sender = socket.user.id;
  const receiver = data.receiver;

  const message = {
    sender,
    receiver,
    content: data.content,
    date: new Date().getTime()
  }

  await Message.create(message);
  socket.to(sender).to(receiver).emit('message', message);
}

const getMessages = async (userId) => {
  const messages = await Message
    .find()
    .or([
      { sender: userId },
      { receiver: userId }
    ]);

  return messages;
}

const getContacts = async function (userId) {
  const contacts = await User.find({
    _id: {
      $ne: userId
    }
  });

  return contacts;
}

const initData = async (socket) => {
  const user = socket.user;

  try {
    const messages = await getMessages(user.id);
    const contacts = await getContacts(user.id);

    socket.emit('data', user, contacts, messages, users);
  } catch (error) {
    socket.disconnect();
  }
}