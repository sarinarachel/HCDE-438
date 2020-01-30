import React, {useState, useEffect} from 'react';
import './App.css';
import UserPicker from './userPicker'
import { db, useDB } from './db';
import { BrowserRouter, Route } from 'react-router-dom'
import {FiCamera} from 'react-icons/fi'
import Camera from 'react-snap-pic'
import * as firebase from "firebase/app"
import "firebase/storage"

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
  const [showCamera, setShowCamera] = useState(false)

  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ 
      img: imgID, name, ts: new Date(), room 
    })
  }

  return <main>

    {showCamera && <Camera takePicture={takePicture} />}

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
      {messages.map((m,i)=> <Message key={i} 
        m={m} name={name} 
      />)}
    </div>
      
    <TextInput 
      onSend={text=> db.send({
        text, name, ts: new Date(), room
      })} 
      showCamera={()=>setShowCamera(true)}
    />
  </main>
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/chatter-app-2020.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message({m, name}){
  return <div className="message-wrap"
    from={m.name===name?'me':'you'}
    onClick={()=>console.log(m)}>
    <div className="message">
      <div className="msg-name">{m.name}</div>
      <div className="msg-text">
        {m.text}
        {m.img && <img src={bucket + m.img + suffix} alt="pic" />}
      </div>
    </div>
  </div>
}

function TextInput(props){
  var [text, setText] = useState('')
  
  return <div className="bottom-bar">
     <button 
      onClick={()=> {
        props.showCamera()
      }}
      className="camera-button"
      >
      <FiCamera/>
      </button>
    
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
