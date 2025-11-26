# express-ts-mongo-api


## Built with

* node v22

## Running local
1. `npm run build`
2. `npm run start`
3. default server port is 3333 

> [!WARNING]
> Requires local instance of MongoDB to be running. Remove `.template` & and populate MongoDB URI into `.env`. Re-run server to connect.

## DB clients used

* [Compass](https://www.mongodb.com/products/tools/compass)
* [Atlas - Cloud hosted MongoDB](https://www.mongodb.com/products/platform)

## Setup

### Linux

TODO

### Mac

General guide: https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/

1. `brew tap mongodb/brew`
2. `brew install mongodb-community@7.0`

The installation includes the following binaries:
* The mongod server
* The mongos sharded cluster query router
* The MongoDB Shell, mongosh

Managing the server

* start server: `brew services start mongodb-community@7.0`
* stop server: `brew services stop mongodb-community@7.0`

#### Troubleshooting

After installing with brew, there were a few required directories & files missing. These had to be manually created. Surely that's not needed... Below are the steps to resolve:

1. Run `mkdir -p /opt/homebrew/var/mongodb`
2. Run `mkdir -p /opt/homebrew/var/log/mongodb`
3. Only if `opt/homebrew/etc` doesn't exit, run `mkdir -p /opt/homebrew/etc`
4. Paste the following into a new file called `mongod.conf`:

```
systemLog:
  destination: file
  path: /opt/homebrew/var/log/mongodb/mongo.log
  logAppend: true

storage:
  dbPath: /opt/homebrew/var/mongodb

net:
  bindIp: 127.0.0.1
  port: 27017
``` 

5. Now, run `mongod` manually as a background process using the config file: `mongod --config ./etc/mongod.conf --fork`
6. A successful result will show the below output:
result: 
```
mongod --config ../etc/mongod.conf --fork
about to fork child process, waiting until server is ready for connections.
forked process: 55926
child process started successfully, parent exiting
```

Confirm server + port is running, use `lsof -i :27017`:

`mongod  55926 user 10u  IPv4 0x59ed6a2a36a11d9d      0t0  TCP localhost:27017 (LISTEN)`