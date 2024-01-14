# Skill-test

Simple project to send notifications to users.

### Start project 

To run this project make sure you have your `.env` variables set and simply run 

```
docker-compose up --build
```

### Other approaches for user notification

#### Firebase
React

```
import { collection, onSnapshot } from "firebase/firestore";

const messagesRef = collection(db, "messages");

onSnapshot(messagesRef, (snapshot) => {
 snapshot.docChanges().forEach((change) => {
   if (change.type === "added") {
     console.log("New message: ", change.doc.data());
   }
   if (change.type === "modified") {
     console.log("Modified message: ", change.doc.data());
   }
   if (change.type === "removed") {
     console.log("Removed message: ", change.doc.data());
   }
 });
});

```

Express

```

const admin = require('firebase-admin');

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://your-database-url.firebaseio.com"
});

var messaging = admin.messaging();

messaging.sendMulticast({
 tokens: [token1, token2, ...],
 notification: {
   title: 'Title of your notification',
   body: 'Body of your notification',
 },
})
.then((response) => {
 console.log('Successfully sent message:', response);
})
.catch((error) => {
 console.log('Error sending message:', error);
});

```
#### Server-Sent Events (SSE)

React

```
const App = () => {

  useEffect(() => {
    const source = new EventSource(`http://localhost:4650/notify`);

    source.addEventListener('open', () => {
      console.log('SSE opened!');
    });

    source.addEventListener('message', (e) => {
      console.log(e.data);
    });

    source.addEventListener('error', (e) => {
      console.error('Error: ',  e);
    });

    return () => {
      source.close();
    };
  }, []);
```


Express
```
const writeEvent = (res: Response, sseId: string, data: string) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (_req: Request, res: Response) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });

  const sseId = new Date().toDateString();

  writeEvent(res, sseId, JSON.stringify(donation));

  writeEvent(res, sseId, JSON.stringify(donation));
};

app.get('/notify', (req: Request, res: Response) => {
  if (req.headers.accept === 'text/event-stream') {
    sendEvent(req, res);
  } else {
    res.json({ message: 'Ok' });
  }
});
```

#### One-Signal
React

```
import OneSignal from 'react-onesignal';

export default async function runOneSignal() {
  await OneSignal.init({ appId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', allowLocalhostAsSecureOrigin: true});
  OneSignal.Slidedown.promptPush();
}


// App.js

import runOneSignal from './onesignal';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    runOneSignal();
  })
```

Express

```
const axios = require('axios');

async function sendNotification(userId, message) {
 const data = {
   app_id: YOUR_ONESIGNAL_APP_ID,
   include_player_ids: [userId],
   contents: {
     en: message
   }
 };

 try {
   const response = await axios.post('https://onesignal.com/api/v1/notifications', data, {
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Basic ${YOUR_ONESIGNAL_REST_API_KEY}`
     }
   });

   console.log('Notification sent successfully:', response.data);
 } catch (error) {
   console.error('Failed to send notification:', error);
 }
}
```

#### AWS SNS

React
```
import { SNS } from 'aws-sdk';

const sns = new SNS({ region: 'us-west-2' }); 

async function fetchMessages(topicArn) {
 const params = {
   AttributeNames: ['All'],
   TopicArn: topicArn
 };

 try {
   const data = await sns.getTopicAttributes(params).promise();
   console.log('Received messages:', data);
 } catch (error) {
   console.error('Failed to fetch messages:', error);
 }
}

setInterval(() => {
 fetchMessages('topicArn'); 
}, 5000);

```

Express

```
async function publishMessage(topicArn, message) {
 const params = {
   Message: message,
   TopicArn: topicArn
 };

 try {
   const data = await sns.publish(params).promise();
   console.log('Message published:', data);
 } catch (error) {
   console.error('Failed to publish message:', error);
 }
}
```