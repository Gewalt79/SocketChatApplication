const users = [];

// Добавляет юзера в массив юзеров
function userJoin(id, username, room) {
  const user = { id, username, room }
  
    users.push(user);

  return user;
}

// Получает конкретного юзера по id
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Юзер покидает чат
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Получает юзеров в конкретной комнате
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};