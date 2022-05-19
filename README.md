<h1>NexHealth QuickStart</h1>

![app](frontend-app.png)

- [Getting started](#getting-started)
- [Prerequisites](#prerequisites)
- [Clone the repository](#clone-the-repository)
- [Configuration](#configuration)
- [Installation](#installation)
- [Starting the Node server and Frontend app](#starting-the-node-server-and-frontend-app)

## Getting started

This repository was created to assist you in getting started with the [NexHealth API](https://docs.nexhealth.com/reference/introduction).
Using this repository, you can rapidly create a [Node](https://nodejs.org/en/) server that interacts with the NexHealth API for appointment scheduling and provider management.

You can book appointments, view them, and manage the providers using the frontend app built with [React](https://facebook.github.io/react/).

## Prerequisites

Please ensure that you have the most recent version of [Node](https://nodejs.org/en/) installed. You can download the latest version of Node [here](https://nodejs.org/en/download/).

## Clone the repository

Using https:

```sh
git clone https://github.com/prabhuignoto/NexHealth
cd NexHealth
```

Alternatively, if you use ssh:

```sh
git clone git@github.com:prabhuignoto/NexHealth.git
cd NexHealth
```

## Configuration

1. To request access to the [NexHealth API](https://docs.nexhealth.com/reference/introduction), fill out this [form](https://www.nexhealth.com/api-request/request-access). You should receive a **subdomain**, a **location_id**, and an **API Key**.

2. Populate an `.env` file in `server/` with the credentials from above.

```sh
cd NexHealth
touch server/.env
```

Here are the mandatory env values you need to successfully start the Node server:

| Properties  | Description                                                     |
| :---------- | :-------------------------------------------------------------- |
| API_URL     | Sandbox url e.g: https://sandbox.nexhealth.com |
| SUBDOMAIN   | Refers to a specific institution                                |
| LOCATION_ID | Refers to a specific location                                   |
| API_KEY     | API Key provided by NexHealth                                   |

Please use the sample `.env.example` located under the server folder as a template.

```sh
API_URL=https://sandbox.nexhealth.com
SUBDOMAIN=xxxx
LOCATION_ID=xxxx
API_KEY=xxxx
```

3. Open the `.env` file in `frontend/`

This is how the file should look:

```sh
REACT_APP_API=http://localhost:4000/api
REACT_APP_LOCATION_ID=<location_id>
```

Change the <location_id> to the one assigned to you.

> Note: `.env` files are convenient for local development. Do not run production applications using .env files.

Please contact the NexHealth team if you have any questions about these values.

## Installation

Install the required dependencies using the following command:

```sh

cd ./server
npm install

cd ./frontend
npm install

```

## Starting the Node server and Frontend app

Navigate to the server folder and run the following command:

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

To start the frontend app:

```sh
cd ./frontend
npm run start
```

If everything was set up correctly, you should be able to access the UI at the following url: http://localhost:3000/
