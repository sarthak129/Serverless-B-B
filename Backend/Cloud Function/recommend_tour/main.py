from google.cloud import bigquery,storage
import boto3
import json
import math
storage_client =storage.Client()
dynamodb_client = boto3.client("dynamodb", 
            region_name='us-west-2', 
            aws_access_key_id="ASIA4JK4ONB7SZZ4BNIN", 
            aws_secret_access_key="QIxW1HExCD2cotiENM8bQJ67FRyB7vA4ilEkd9EM",
            aws_session_token="FwoGZXIvYXdzEEAaDCx4ZTymfY44OH0t3yLAAbqHTZlypLLZvffz4epDt0RS8fIuW2ENAUhCp9GFTRrzjOkHVirELoUeE4CYp0gbGanwwIoQpl4HsBzRESqa3ycU2zqWOaJ4+95VMreY1BUf1xedF/4Jv+CAnPFHPqMYdJsSftZ3wxN898R9JavFm8NUEhIRKJMohfDcCT/SJbELsBO5H8+Hsv6sH9e7iGu91rZ/P1yfB7SjhsQ9uQ6HJmEv+qu0joC5JzxtCiR9qBDuMoQyMFyUFgJmlLu9IrJ4Oij7gfCWBjItPzRvc+KzKlp92mkVCIlSxyuzhAAAU9ZpDyjExW7/ZLy3xjvq91aGLrk6CyGk")
def item(user_id):
  client = bigquery.Client()

  response = dynamodb_client.get_item(
  TableName="User",
  Key={
      'id': {'S': user_id},
      
  })
  dict={}
  item=response['Item']
  for i in response['Item']:
      values=item.get(i)
      values=list(values.values())
      print(i)
      print(values)
      dict[i]=values[0]
  print(dict)
  BUCKET = storage_client.get_bucket("user_predict_data")
  file_name="Predict"+dict.get('id')+".json"
  print(file_name)
  blob = BUCKET.blob(file_name)
  blob.upload_from_string(
      data=json.dumps(dict),
      content_type='application/json'
  )
  job_config = bigquery.LoadJobConfig(
  schema=[
      bigquery.SchemaField("id", "INTEGER"),
      bigquery.SchemaField("first_name", "STRING"),
      bigquery.SchemaField("no_of_days_hotel", "INTEGER"),
      bigquery.SchemaField("no_of_days_tour", "INTEGER"),
      bigquery.SchemaField("cost_of_hotel", "FLOAT"),
      bigquery.SchemaField("cost_of_tour", "FLOAT"),
      bigquery.SchemaField("no_of_people", "INTEGER"),
  ],
  source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
  )


  table_id="assignment1-352422.Project.Predict"+dict.get('id')
  uri = "gs://user_predict_data/Predict"+dict.get('id')+".json"
  print(uri)
  load_job = client.load_table_from_uri(
  uri,
  table_id,
  location="US",  # Must match the destination dataset location.
  job_config=job_config,
  )  # Make an API request.

  load_job.result()  # Waits for the job to complete.
  destination_table = client.get_table(table_id)
  print("Loaded {} rows.".format(destination_table.num_rows))
    
def make_prediction(request):
# Construct a BigQuery client object.

  request=request.get_json()
  
  user_id=request['id']
  print(request)
  print(request['id'])
  
  item(user_id)
  client = bigquery.Client()
  sql = """
      SELECT
  *
  FROM
  ML.PREDICT(MODEL `assignment1-352422.Project.tour_model`,
      (
      SELECT
      *
      FROM
      `assignment1-352422.Project.Predict{m}`))
  """.format(m=user_id)

  # Start the query, passing in the extra configuration.
  query_job = client.query(sql)  # Make an API request.
  query_job.result()  # Wait for the job to complete.
  
  if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

  for row in query_job:
      result=row[0]
  responseBody={}
  response=dynamodb_client.put_item(TableName="Tour_recommendation",Item={'Customer_id':{'S':str(user_id)},'days':{'N':str(math.ceil(result))}})

  responseBody["days"]=math.ceil(result)
  responseBody['statusCode']=200
  responseBody['headers']={}
  responseBody['Access-Control-Allow-Origin']="*"
  responseBody['headers']['ContentType']="application/json"
  

  return responseBody
    

   


