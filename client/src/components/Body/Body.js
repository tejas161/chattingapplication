import React from 'react';
import './Body.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Swal from "sweetalert2";


const Body = ({ users, setMessage, sendMessage, message, messages, name }) => {

    const getloc = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          } else {
           alert("Geolocation is not supported by this browser.");
          }
    }

  
function  showPosition(position) {

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

   var api_key = 'af1e7ebdb30a4ee8bb965d0fefda6f38';
 
   
     var api_url = 'https://api.opencagedata.com/geocode/v1/json'
   
     var request_url = api_url
       + '?'
       + 'key=' + api_key
       + '&q=' + encodeURIComponent(latitude + ',' + longitude)
       + '&pretty=1'
       + '&no_annotations=1';
   
     // see full list of required and optional parameters:
     // https://opencagedata.com/api#forward
   
     var request = new XMLHttpRequest();
     request.open('GET', request_url, true);
   
     request.onload = function() {
       // see full list of possible response codes:
       // https://opencagedata.com/api#codes
   
       if (request.status === 200){ 
         // Success!
         var data = JSON.parse(request.responseText);
         var ans = data.results[0].formatted; // print the location
   
         setMessage(ans);
   
       } else if (request.status <= 500){ 
         // We reached our target server, but it returned an error
                              
         console.log("unable to geocode! Response code: " + request.status);
         var data = JSON.parse(request.responseText);
         console.log('error msg: ' + data.status.message);
       } else {
         console.log("server error");
       }
     };
   
     request.onerror = function() {
       
       console.log("unable to connect to server");        
     };
   
     request.send();  // make the request
   
 
}




    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
      

        Swal.fire({
            title: 'Error!',
            text: 'Browser doesnt support speech recognition.',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
    }
    if (transcript != '') {

        setMessage(transcript);
    }
   


    const cleartext = (e) => {
        resetTranscript();

        sendMessage(e);
        setMessage('');
    }

    return (
        <>
            <div className='body-container'>
                {users ? (

                    <div className='left-body'>
                        <h2>Active People:</h2>
                        <div className="active-class">

                            {users.map(({ name }) => (

                                <div key={name} className="active-people">
                                    <div className="img"></div>
                                    <p>{name}</p>


                                </div>
                            ))}


                        </div>
                    </div>) : null}

                <div className='right-body'>

                    <ScrollToBottom className="text-messages">
                        {messages.map((message, i) => <div key={i}><Message message={message} name={name} /></div>)}
                    </ScrollToBottom>

                    <div className='input-box'>


                        
                   
                    
                        <input
                            id="input"
                            className="input"
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={({ target: { value } }) => setMessage(value)}
                            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                        />
                        <i id="map" onClick={getloc} className="fas fa-route"></i>
                        <i id="micro-phone" onClick={SpeechRecognition.startListening} className="fas fa-microphone "></i>

                        <button className="sendButton" onClick={cleartext}>Send</button>
                    </div>

                </div>


            </div>


        </>
    );


}


export default Body;