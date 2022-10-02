import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";



import InfoBar from '../InfoBar/InfoBar';
import Body from '../Body/Body';


import './Chat.css';



let socket;
const Chat = ({}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const navigate = useNavigate();

    var connectionOptions = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        "transports": ["websocket"]
    };
    const ENDPOINT = 'https://groupchord.herokuapp.com/';

    // const ENDPOINT = 'http://localhost:5000/';

    useEffect(() => {
      
        const { name, room } = queryString.parse(window.location.search);
       
        socket = io(ENDPOINT,connectionOptions);


        setRoom(room);
        setName(name);


        socket.emit('join', { name, room }, (error) => {
            if (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'Cool'
                  })
                navigate('/');

            }
        });
    }, [ENDPOINT, window.location.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);


    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
      
            <div className="chat-container">


                <InfoBar room={room} />
                <Body messages={messages} name={name} users={users} message={message} setMessage={setMessage} sendMessage={sendMessage} />
              
            </div>

      
    );
}


export default Chat;