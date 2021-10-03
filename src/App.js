import io from "socket.io-client";
import { useState } from "react";
import Chat from './Chat'

const socket = io.connect("http://localhost:3000");

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)

  // Подключиться к комнате
  const join = async() => {
    if (username && room) {
      await socket.emit("join_room", username, room)
      setShowChat(true)
    }
  }

  return (
    <div className="App">
      <div>
        {showChat ? 
           <Chat socket={socket} username={username}/>
           :
            <div className="start_page">
              <h1>Enter your name and chat</h1>
              <input type="text" placeholder="Enter your name" onChange={(e)=> setUsername(e.target.value)}></input>
              <input type="text" placeholder="Enter room name" onChange={(e)=> setRoom(e.target.value)}></input>  
              <button onClick={join}>Enter</button>
            </div>
              }
      </div>
    </div>
  ); 
}

export default App;
