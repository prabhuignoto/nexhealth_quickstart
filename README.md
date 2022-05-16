# NexHealth Appointment Manager

![app](2022-05-16-15-04-17.png)

## Getting started

This repository was created to assist you in getting started with the NexHealth API.
Using this repository, you can rapidly create a server that interacts with the NexHealth API for appointment scheduling and provider management.

You can book appointments, view them, and manage the providers using the Frontend app built with [React](https://facebook.github.io/react/).

The user interface code can be found within the frontend folder, and the backend code can be found within the server folder.

## Configuration

Please ensure that you have permission to use the NexHealth API. Fill out the form to request access.

Once you have access, you can populate the.env file under the server folder with the appropriate values.

Following are the Mandatory values you would need to start the Node server successfully:

| Properties  | description                                                       |
| :---------- | :---------------------------------------------------------------- |
| API_URL     | This could be the sandbox url, e.g: https://sandbox.nexhealth.com |
| DOMAIN      | Refers to a specific Institution                                  |
| LOCATION_ID | Refers to a specific location                                     |
| API_KEY     |                                                                   |

Please contact the NexHealth team if you have any questions.

## Installation

Install the required dependencies using the following command:

```sh

cd ./server
npm install

cd ./frontend
npm install

```

## Starting the server and frontend

Change in to the server folder and run the following command:

```sh
cd ./server
npm run start
```

If everything is working, you should see the following message:

```sh
[nodemon] reading config .\nodemon.json
[nodemon] to restart at any time, enter `rs`
[nodemon] or send SIGHUP to 14688 to restart
[nodemon] ignoring: .git node_modules/**/node_modules
[nodemon] watching path(s): *.js routers\*.js
[nodemon] watching extensions: js,json
[nodemon] starting `node --harmony index.js`
[nodemon] spawning
[nodemon] child pid: 11036
[nodemon] watching 8 files
Server is running on port 4000
```

Lets go ahead and start the frontend app.

```sh
cd ./frontend
npm run start
```

If everything was setup correctly, you should be able to access the ui at the following url: http://localhost:3000/

## Built with

[React](https://facebook.github.io/react/)
[Node.js](https://nodejs.org/)
[Express](http://expressjs.com/)
