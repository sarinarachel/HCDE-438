import React, {useState, useEffect} from 'react';
import './App.css';
import UserPicker from './userPicker'
import { db, useDB } from './db';
import { BrowserRouter, Route } from 'react-router-dom'

function App(){
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  }, [])
  return <BrowserRouter>
    <Route path="/:room" component={Room} />
  </BrowserRouter>
}

function Room(props) {
  const {room} = props.match.params
  const [name, setName] = useState('')
  const messages = useDB(room)

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
      return <div key={i} className="message-wrap"
      from={m.name===name?'me':'you'}>
      <div className="message">
        <div className="msg-name">{m.name}</div>
        <div className="msg-text">{m.text}</div>
      </div>
    </div>
  })}
</div>

    <TextInput 
      onSend={text=> db.send({
        text, name, ts: new Date(), room
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
