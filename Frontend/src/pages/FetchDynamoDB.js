import React from "react";

export function FetchDyanamoDB() {
    
    const [data, setData] = React.useState([]);
    var request = fetch('https://i4qqwljze6.execute-api.us-east-1.amazonaws.com/prod', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'piuRymFaE98k3K3jHbW3V4vzqUC1yWjqafsNFzdU',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
        return data;
      })
      .catch((error) => console.log('Error while fetching:', error));
    
  }
