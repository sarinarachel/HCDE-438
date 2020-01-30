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
    apiKey: "AIzaSyCqmv8hEYeW00hgs-4kLBcvCqVI1gRXQGw",
    authDomain: "chatter-app-2020.firebaseapp.com",
    databaseURL: "https://chatter-app-2020.firebaseio.com",
    projectId: "chatter-app-2020",
    storageBucket: "chatter-app-2020.appspot.com",
    messagingSenderId: "549202083599",
    appId: "1:549202083599:web:87463e37534bebcf08487a",
    measurementId: "G-VF4XJK7TRN"
  };

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()