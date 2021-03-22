import { useEffect, useState } from 'react';
import './room.css'
import socketIOClient from 'socket.io-client'

const socket = socketIOClient('http://localhost:8080', {transports: ['websocket', 'polling', 'flashsocket']})
//to avoid cors policy

function Message(props) {
   return (
      <li className=''>
         <p>{props.content}</p>
         <p>{props.sender}</p>
      </li>
   );
}

export function Room() {
   const [messages, setMessages] = useState([])
   const [msgContent, setMsgContent] = useState('')

   useEffect(() => {
      async function fetchMessages(){
         try {
            let res = await fetch('http://localhost:8080/messages')
            let data = res.json()

            return data

         }catch(err){
            console.error(err)
         }
      }

      let data = fetchMessages()
      data.then(result => {
         setMessages(result.map(msg => 
            <Message content={msg.content} sender={msg.User.pseudo} key={msg.id} />
         ))
      })

   }, [])

   useEffect(() =>{
      socket.on('connect', data => {
         console.log('connected to backend')
      })
   }, [])
   
   function sendMessage(e){
      e.preventDefault()

      let newMsg = {
         content: msgContent,
         user_id: 1,
      }
      
      socket.emit("sendMsg", newMsg)
      
      setMessages(messages => [...messages, 
         <Message 
            content={newMsg.content} 
            sender='Toinou'
            key={6}
         />])

      setMsgContent('')
   }

   function handleContentChange(e){
      setMsgContent(e.target.value)
   }

   return (
      <div className=''>
         <ul>
            {messages}
         </ul>
         <form>
            <input type="text" placeholder="content" value={msgContent} onChange={handleContentChange}></input>
            <input type="submit" onClick={sendMessage} value="envoyer"></input>
         </form>
      </div>
   );
}