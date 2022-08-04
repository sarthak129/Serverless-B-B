import React from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { toast } from "react-toastify";
import { Button, Input, Spin, Typography } from "antd";
import LexChat from "react-lex";
import { FetchDyanamoDB } from './FetchDynamoDB';
import Card from 'react-bootstrap/Card';


function Kitchen()
{
     const [isLoading, setIsLoading] = React.useState(true);
     const [data, setData] = React.useState([]);
    React.useEffect(() =>{
       fetch('https://i4qqwljze6.execute-api.us-east-1.amazonaws.com/prod', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'piuRymFaE98k3K3jHbW3V4vzqUC1yWjqafsNFzdU',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("testing ",res);
         setData(res);

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

        
        
        
        <div className="kitch">
            <FetchDyanamoDB></FetchDyanamoDB>
        <div className="intro">
            <h2>Welcome to our Kitchen!!</h2>
            <h3>To start ordering chat with our chatbot!</h3>
            <h3>Dishes in our inventory:</h3>
        </div>

        { <div className="kitchen-home">
        {isLoading ? (
                <h1>Loading...</h1>
                ) : (
        data.map((tour) => (

                
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                  
                  <Card.Subtitle className="mb-2 text-muted">Dish : {tour.dishid}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">Quantity : {tour.quantity}</Card.Subtitle>
                  
                  
                  
                  
                </Card.Body>
              </Card>
        ))
                )}
        </div> }
        </div>
    );
    
}

export {Kitchen};
