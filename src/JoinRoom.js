import React, { useRef } from "react";

export default function JoinRoom({socket, room, username}) {
    const chatRoom = useRef()
        // Получает основную комнату в которой находится юзер
        socket.on("get_room", (rm) => {
            chatRoom.current = rm
            console.log(rm)
        })
    // Подключает к комнате имя которой передано в компонент
   const join = async() => {
    await socket.emit("join_room", username, room)
  }

    return (
        <div>
            <button className={chatRoom.current === room ? "current" : ""} onClick={join}>{room}</button>
        </div>
    )
}
