import React from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';
import 'bootstrap/dist/css/bootstrap.css';

function AvailTour(props) {

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modelOpen, setModelOpen] = React.useState(false);
    const [tourData, setTourData] = React.useState([]);
    const navigate = useNavigate();

    const navigateToHomePage = () => {
      //https://tvgimocqtsdgeugip4phyxif3a0fggfh.lambda-url.us-west-2.on.aws/
      fetch('https://tvgimocqtsdgeugip4phyxif3a0fggfh.lambda-url.us-west-2.on.aws/', {
            method: 'POST',
            body: JSON.stringify({
                "customer_id" : props.auth.user?.username,
                "tour_id" : tourData.tour_id,
                "no_of_days" : tourData.no_of_days,
                "tour_country" : tourData.tour_country,
                "no_of_people" : tourData.number_of_people
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
      navigate('*')
    }

  React.useEffect(() => {
    fetch('https://ghjyjskfovukjda4lwzc5xfyui0qtaxr.lambda-url.us-west-2.on.aws/', {
      method: 'POST',
      body: JSON.stringify({
        "customer_id": props.auth.user?.username,
      })
    }).then(function (serverPromise) {
      serverPromise.json()
        .then(function (j) {
          console.log(j[0].tour_id);
          setData(j);
        })
        .catch(function (e) {
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
    
    const handleModelOpen = (tour) => {
      console.log("Model value before : ", modelOpen);
      setModelOpen(!modelOpen)
      setTourData(tour)
      console.log("is model open " + modelOpen);
    }

    const bookTour = () => {
      alert("Your tour is booked!!!! Enjoy")
    }

    return (
        <div>
            <br></br>
            <h2>Available Tour</h2>
            <div>
            {isLoading ? (
                <h1>Loading...</h1>
                ) : (
              data.map((tour) => (
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{tour.tour_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Country : {tour.tour_country}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Rating : {tour.tour_rating}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Number of Days : {tour.no_of_days}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">age range : {tour.age_range}</Card.Subtitle>
                  <Card.Text>
                    <b>Tour Places : </b>{tour.tour_places.map((place) => (place + ","))}
                  </Card.Text>
                  <Button onClick={() => handleModelOpen(tour)} value={tour}>Book Tour</Button>
                  
                </Card.Body>
              </Card>
        ))
      )}

          <Modal show={modelOpen} >
              <Modal.Header closeButton>
                 <Modal.Title>Tour Booking</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to book ? </Modal.Body>
              <Modal.Footer>
                 <Button variant="danger" onClick={navigateToHomePage}>
                    Yes
                 </Button>
              </Modal.Footer>
          </Modal>
    </div>
        </div>
    )
}

export default AvailTour;