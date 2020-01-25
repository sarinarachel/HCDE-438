import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])

    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> b.ts.seconds - a.ts.seconds)
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    
    useEffect(() => {
        store.collection(coll)
        .where('room','==',room)
        .onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyDWXVgUqm3xATyzqUqTxcpvsW7U804ctXI",
    authDomain: "chatter20202020.firebaseapp.com",
    databaseURL: "https://chatter20202020.firebaseio.com",
    projectId: "chatter20202020",
    storageBucket: "chatter20202020.appspot.com",
    messagingSenderId: "630230183323",
    appId: "1:630230183323:web:cc967f51fc79e394ca053e"
}

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()