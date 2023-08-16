### Start
    npm i
    node index.js
    node m2.js

### Testing:
- find out what you have on the RabbitMQ website
- send a POST request by pointing to the url http://localhost:2000 body = 
  ```
  {
  "id":1,
  "status": "CREATE"
  }
  ```
- in response, you should get the changed status