import React, {useState} from 'react';
import './App.css';

function App() {
  return <main>

    <header>
      <img className="logo"
        alt="logo"
        src="https://www.salsify.com/hubfs/Salsify-Chat-Icon.png"
      />
      Chatter
    </header>

    <TextInput onSend={m=> console.log(m)} className="input"/>

  </main>
}

function TextInput(props){
  var [text, setText] = useState('')
  
  return <div className="text-input-wrap">
    <input value={text} className="text-input"
    placeholder="Type your thoughts..."
    onChange = {e=> setText(e.target.value)}
    />

    <button onClick={()=> {props.onSend(text)
    setText('')}}
    className="send">
      <img className="send-img"
        alt="send"
        src="https://cdn3.iconfinder.com/data/icons/email-51/48/44-512.png"
        />
    </button>
  </div>
}

export default App
