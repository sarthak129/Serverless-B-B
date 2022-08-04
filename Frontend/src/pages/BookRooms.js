import React from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';

import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'




export default function BookRooms(props) {

    const [data, setData] = React.useState([]);
    const [selectedRoom, setSelectedRoom] = React.useState([]);
    const [selectedRoomType, setSelectedRoomType] = React.useState([]);

    const [isLoading, setIsLoading] = React.useState(true);
    const [modelOpen, setModelOpen] = React.useState(false);
    const [successModelOpen, setSuccessModelOpen] = React.useState(false);

    const navigate = useNavigate();
    const [checkInDate, setCheckInDate] = React.useState(new Date());
    const [checkOutDate, setCheckOutDate] = React.useState(new Date());


    const navigateToHomePage = () => {
        setSuccessModelOpen(!successModelOpen)
        navigate('*')
      }

    const bookCustomer = () => {
        var daysDiff = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
        var no_of_days = Math.floor(daysDiff / (1000 * 60 * 60 * 24));
    
        fetch('https://s4pf6fpalw5rnaf3acedyyibxa0qkbbx.lambda-url.us-west-2.on.aws/', {
            method: 'POST',
            body: JSON.stringify({
                "customer_id": props.auth.user?.username,
                "room_id" : selectedRoom,
                "checkin_date" : checkInDate,
                "checkout_date" : checkOutDate,
                "no_of_days_of_stay" : no_of_days,
                "room_type" : selectedRoomType
           })
          }).then(function(serverPromise){ 
            serverPromise.json()
              .then(function(j) { 
                console.log(j); 
                
              })
              .catch(function(e){
                console.log(e);
              });
          })
        setModelOpen(!modelOpen)
        setSuccessModelOpen(!successModelOpen)
      }

    const handleModelOpen = (e) => {
        console.log("Model value before : ", e);
        setSelectedRoom(e.room_id)
        setSelectedRoomType(e.room_type)
        setModelOpen(!modelOpen)
  
        console.log("is model open " + modelOpen);
      }


    React.useEffect(() => {
        fetch('https://4uvpzzerdnqjqjhj4mdiljgheu0vpvcp.lambda-url.us-west-2.on.aws/', {
        method: 'GET',
        // headers: {
        //   "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        //   "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        // },
      }).then(function(serverPromise){ 
        serverPromise.json()
          .then(function(j) { 
            console.log(j); 
            setData(j)
          })
          .catch(function(e){
            console.log(e);
          });
      })
        .catch((error) => console.log('Error while fetching:', error));
    }, [])

    React.useEffect(() => {
        if (data.length !== 0) {
          setIsLoading(false);
        }
        console.log(data);
      }, [data]);

    return (
        <div>
            <br></br>
            <h2>Available Rooms For Booking</h2>
            <div>
            {isLoading ? (
                <h1>Loading...</h1>
                ) : (
              data.map((room) => (
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{room.room_type}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted" >Beds : {room.no_of_beds}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">WIFI : {room.wifi_availability}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Maximum People : {room.max_no_of_people}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Price : {room.price_per_night} CAD</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Room Size : {room.room_size}</Card.Subtitle>

                  <Card.Text>
                    {/* <b> : </b>{tour.tour_places.map((place) => (place + ","))} */}
                  </Card.Text>
                  <Button onClick={() => handleModelOpen(room)} value={room}>Book Tour</Button>
                  {/* <Card.Link onClick={handleModelOpen} >Book Tour</Card.Link> */}
                  
                </Card.Body>
              </Card>
        ))
      )}
      
            </div>

            <Modal show={modelOpen} >
              <Modal.Header closeButton>
                 <Modal.Title>Room Booking</Modal.Title>
              </Modal.Header>
             
             <p style={{display: "flex"}}>Checkin Date:     <DatePicker selected={checkInDate} dateFormat='yyyy-mm-dd' onChange={setCheckInDate} value={setCheckInDate}/> </p>
             <p style={{display: "flex"}}>Checkout Date:     <DatePicker selected={checkOutDate} dateFormat='yyyy-mm-dd' onChange={setCheckOutDate} value={setCheckOutDate} /> </p>
             
              <Modal.Footer>
                 <Button variant="danger" onClick={bookCustomer}>
                    Yes
                 </Button>
              </Modal.Footer>
          </Modal>

          <Modal show={successModelOpen} >
              <Modal.Header closeButton>
                 <Modal.Title>Room Booking</Modal.Title>
              </Modal.Header>
             
            <Modal.Body>
                Your room has been booked!!!!!
            </Modal.Body>
              <Modal.Footer>
                 <Button variant="danger" onClick={navigateToHomePage}>
                    Yes
                 </Button>
              </Modal.Footer>
          </Modal>
        </div>
    )
}
