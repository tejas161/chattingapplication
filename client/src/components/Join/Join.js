import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Join.css';
import Swal from "sweetalert2";



const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const salert = (e) => {
        e.preventDefault();
    Swal.fire({
        title: 'Error!',
        text: 'Name or Room Details empty!!',
        icon: 'error',
        confirmButtonText: 'Cool'
      })

    };

    return (
        <>
            <div className="navbar">
                <div className="nav-img">
                    <img src="./title.jpeg" alt="heading image" />
                </div>
                <div className="nav-header">
                    <h3>Group Chord</h3>
                </div>
            </div>
            <div className="input-form">
                <div className="form-unit">
                    <input placeholder="Name" type="text" className="user-name" onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="form-unit ">
                    <select className="user-room" id="user-room" name="user-room" onChange={(event) => setRoom(event.target.value)}>
                        <option disabled selected hidden value="">Select Room</option>
                        <option value="ACE">ACE</option>
                        <option value="Python">Python</option>
                        <option value="Web Dev">Web Dev</option>
                        <option value="Besties">Besties</option>

                    </select>

                </div>

                <div className="form-unit ">
                    <Link onClick={e => (!name || !room) ? salert(e) : null} to={`/chat?name=${name}&room=${room}`}>
                        <button className="submit-btn" type="submit">Sign In</button>
                    </Link>
                </div>
            </div>

           
        </>
    );
};


export default Join;




