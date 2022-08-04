import React from 'react';
import Card from 'react-bootstrap/Card';


function FoodStatus() {

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    let username = "vikas";
    const getAnswer =  () => {
        fetch('https://2nzgdt3ds4ct5jbcb2eylszc5u0jqfaz.lambda-url.us-west-2.on.aws/', {
            method: 'POST',
            body: JSON.stringify({
                "username": username
           })
        }).then(function(serverPromise){ 
            serverPromise.json()
              .then(function(j) { 
                console.log(j[0].username); 
                setData(j);
              })
              .catch(function(e){
                console.log(e);
              });
          })
      };
    
      React.useEffect(() => {
        const timer = setInterval(getAnswer, 5000);
        console.log(data.answer)
        if (data.answer == "yes") {
            console.log("clearing timer")
            clearInterval(timer);
        }
        // return () => clearInterval(timer);
      }, []);
      React.useEffect(() => {
        if (data.length !== 0) {
          setIsLoading(false);
        }
        console.log(data);
      }, [data]);
    // React.useEffect(() => {
    //     fetch('https://2nzgdt3ds4ct5jbcb2eylszc5u0jqfaz.lambda-url.us-west-2.on.aws/', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             "username": username
    //        })
    //     }).then(res => (console.log(res.json())))
    // })

    return (
        <div>
            <br></br>
            <h2>Your Food Orders</h2>
            <br></br>
            <div>
            {isLoading ? (
                <h1>Loading...</h1>
                ) : (
              data.map((food) => (
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{food.item_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Item : {food.item_name}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Number of items ordered : {food.no_of_items}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Status: {food.status}</Card.Subtitle>
                  {/* <Card.Subtitle className="mb-2 text-muted">age range : {tour.age_range}</Card.Subtitle> */}
                  {/* <Card.Text>
                    <b>Tour Places : </b>{tour.tour_places.map((place) => (place + ","))}
                  </Card.Text> */}
                  {/* <Card.Link onClick={handleModelOpen}>Book Tour</Card.Link> */}
                  
                </Card.Body>
              </Card>
        ))
      )}
            </div>
        </div>
    )
}

export default FoodStatus;