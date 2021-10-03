import React, {  useState } from "react";

export default function ChatUsers({socket, currentUser}) {

    const [users, setUsers] = useState([])
    //Принимает массив и достает username 
    socket.on("room_users", (us) => {
        console.log(us)
        us.forEach(el => {
            const userName = Object.values(el)[1];
            if (!users.includes(userName))
            {
                users.push(userName)
            }
        })
    })
    
    return (
        <div className="Chat_users">
            <h5>Users in room</h5>
            {users.map((user)=> {
                return (
                    <p className={currentUser === user ? "you_user" : ""}>{user}</p>
                )
            })}
        </div>
    )
}
