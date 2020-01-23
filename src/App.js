import React, {useState, useEffect} from 'react';
import './App.css';
import UserPicker from './userPicker'
import { db } from './db';

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  
  useEffect(()=>{
    db.listen({
      receive: m=> {
        setMessages(current=> [m, ...current])
      },
      remove: id=> {
        setMessages(current=> [...current].filter(m => m.id !== id))
      },
    })
  },[])

  return <main>


    <header>
      <div className="logo-wrap">
        <img className="logo"
          alt="logo"
          src="https://www.salsify.com/hubfs/Salsify-Chat-Icon.png"
        />
      Chatter
      </div>
      <UserPicker onSave={setName}/>
    </header>

    <div className="messages">
    {messages.map((m, i)=>{
      return <div key={i} className="message-wrap">
        <div key={i} className="message">{m.text}</div>
      </div>
    })}
    </div>

    <TextInput 
      onSend={text=> db.send({
        text, name, ts: new Date()
      })} 
    />

  </main>
}

function TextInput(props){
  var [text, setText] = useState('')
  
  return <div className="text-input-wrap">
    <input 
    value={text} 
    className="text-input"
    placeholder="Type your thoughts..."
    onChange = {e=> setText(e.target.value)}
    onKeyPress={e=> {
      if(e.key==='Enter') {
        if(text) props.onSend(text)
        setText('')
      }
    }}
    />

    <button onClick={()=> {
      if(text) {props.onSend(text)}
      setText('')}}
      className="send"
      disabled={!text}
      >
      <img className="send-img"
        alt="send"
        src="https://cdn3.iconfinder.com/data/icons/email-51/48/44-512.png"
        />
    </button>
  </div>
}

export default App
