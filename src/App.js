import React, {useState} from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([])
  
  console.log(messages)
  return <main>

    <header>
      <img className="logo"
        alt="logo"
        src="https://www.salsify.com/hubfs/Salsify-Chat-Icon.png"
      />
      Chatter
    </header>

    <div className="messages">
    {messages.map((m, i)=>{
      return <div key={i} className="message-wrap">
        <div key={i} className="message">{m}</div>
      </div>
    })}
    </div>

    <TextInput 
      onSend={text=> {setMessages([text, ...messages])}} 
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
