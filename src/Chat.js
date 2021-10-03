import React, { useEffect, useState, useRef } from "react";
import ChatUsers from "./ChatUsers";
import JoinRoom from "./JoinRoom"

export default function Chat({socket, username}) {
   const [currentMessage, setCurrentMessage] = useState("");
   const [messageList, setMessageList] = useState([{}]);
   const [newRoom, setNewRoom]  = useState("");
   const [rooms, setRooms] = useState([])
   const currentRoom = useRef()
   const currentUser = username;

   // Отправляет сообщение
   const sendMessage = () => {
       const msg = {
           room: currentRoom.current,
           username: currentUser,
           text: currentMessage
       }
     if (currentMessage !== "") {
        socket.emit("receive_message", msg)
        console.log(msg) // ЭТО ОБЪЕКТ ИСПРАВЬ НА БЭКЕ
        setCurrentMessage("");
     }
   };
   // Подключается к новой комнате
   const join = () => {
    socket.emit("join_room", currentUser, newRoom)
    setRooms((prev)=> [...prev, newRoom])
  }

  // При получении сообщения
   useEffect(() => {
       socket.on("send_message", ({username, text, room}) => {
           if (room === currentRoom.current) {
            setMessageList((messages)=> [...messages, {username, text}])
           }
       })
   }, [socket])
   // Получает имя комнаты после подключения к новой комнате
   useEffect(() => {
    socket.on("get_room", (room) => {
        currentRoom.current = room
    })
}, [socket])

    return (
        <div className="just">
            <div className="chat">
                <div className="enter_new_chat">
                    <input type="text" placeholder="enter room name" onChange={(e)=> setNewRoom(e.target.value)}/>
                    <button onClick={join}>Enter new chat</button>
                    {rooms.map((rm)=> {
                        return (
                            <JoinRoom socket={socket} username={currentUser} room={rm}/>
                        )
                    })}
                </div>
                <div className="message_box">
                <h5>Current room: <p>{currentRoom.current}</p></h5>
                    {messageList.map((obj) => {
                        if (obj.text) {
                            return (
                                <div className={currentUser === obj.username ? "you" : "other"}>
                                    <div className="message_text">
                                       <p>{obj.text}</p>
                                    </div>
                                    <div className="message_bottom">
                                       <p className="message_author">{obj.username}</p>
                                       <p className="message_time">{new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()}</p>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <ChatUsers currentUser={currentUser} socket={socket}/>
            </div>
            <div className="chat_box">
                       <input value={currentMessage} type="text" placeholder="Your message" onChange={(e)=> setCurrentMessage(e.target.value)}/>
                       <button onClick={()=> sendMessage()}>Send</button>
                    </div>
        </div>
    )
}
