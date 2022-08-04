import json
import boto3
import urllib3
import uuid
import boto3
from boto3.dynamodb.conditions import Key
import base64
client = boto3.client('dynamodb')
result = {}
intent=""
userid=""
dishid =""
quantity=""
res=""

def lambda_handler(event, context):
    intent=(event['sessionState']['intent']['name'])
    if intent.lower()=='food':
        
        #userid and dishid is fetched 
        userid=(event['sessionState']['intent']['slots']['user_id']['value']['originalValue'])
        dishid=(event['sessionState']['intent']['slots']['dish_id']['value']['originalValue']) 
        dishid = dishid.lower()
        
        quantity=(event['sessionState']['intent']['slots']['quantity']['value']['originalValue'])
        
        url = "https://pvkhb6bwhls4sr4tubqfg2rq4i0vfcxk.lambda-url.us-east-1.on.aws/"
        data = {
                 "user_id":str(userid)
                }
        param = json.dumps(data)
        http = urllib3.PoolManager()
        res = http.request('POST', url, headers={'Content-Type': 'application/json'}, body=param)
        final = json.loads(res.data.decode('utf-8'))
        user_data = final.get("data") 
        message="fail" 

        for user in user_data:
            if userid == user.get("emailId"):
                message="success"
                result = kitchen_order(userid,dishid,quantity,user_data)
                
            if message=="fail":
                result={
                     "messages": [
                      {
                      "content": "Sorry can't find your email id.",
                      "contentType": "PlainText"
                      }
                     ],
                     "sessionState": {
                      "dialogAction": {
                      "type": "Close"
                      },
                      "intent": {
                      "name": "food",
                      "state": "Fulfilled",
                      "confirmationState": "None"
                      }
                     }
                    }
    if intent.lower()=="menu":
        result = get_menu()  
        
    return result
    
     
        
def get_menu():
    client = boto3.resource('dynamodb')
    table = client.Table('Menu')
    get_menu = table.scan() 
    items = get_menu.get("Items")
    text = str(items).replace("[","").replace("]","").replace("{","")
    text  = text.replace("}","").replace("Decimal(","").replace("'","").replace(")","")
    global result
    result ={
                     "messages": [
                      {
                      "content": text,
                      "contentType": "PlainText"
                      }
                     ],
                     "sessionState": {
                      "dialogAction": {
                      "type": "Close"
                      },
                      "intent": {
                      "name": "food",
                      "state": "Fulfilled",
                      "confirmationState": "None"
                      }
                     }
                    }
    return result
            

    
        
def kitchen_order(userid,dishid,quantity, user_data):
        client = boto3.client('dynamodb')
    
        response1 = client.get_item(TableName='Menu',Key={'Item': {'S': dishid,}})
        price = response1['Item']['Price']['N']
        price_int = int(price)
        
        useridtable= userid
        #response['Item']['userid']['S']
        print(useridtable)
        quantity_int = int(quantity)
        order_id = uuid.uuid1()
        print("Order Id: ",order_id)
        total_price = quantity_int * price_int
        client.put_item(TableName='Kitchen', Item={'user_id':{'S': str(useridtable)},'dish_id':{'S':dishid}, 'OrderID':{'S': str(order_id) }, 'quantity':{'S':quantity}, 'Total': {'S':str(total_price)}   })
        res="Your Order Invoice is :"+str(order_id)+ ", Item is" +str(dishid)+ "and Your Total Price including tax is "+str(total_price) 
        print("Res",res)
        global result

        result ={
                 "messages": [
                  {
                  "content": res,
                  "contentType": "PlainText"
                  }
                 ],
                 "sessionState": {
                  "dialogAction": {
                  "type": "Close"
                  },
                  "intent": {
                  "name": "food",
                  "state": "Fulfilled",
                  "confirmationState": "None"
                  }
                 }
                }
        return result
    