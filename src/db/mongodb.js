// THE COMMAND TO RUN Mongodb ON TERMINAL:
// /Users/lihiy/mongodb/bin/mongod.exe --dbpath=/Users/lihiy/mongodb-data


// CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName)


    // Create:

    // db.collection('users').insertOne({
    //     name: 'Rivka',
    //     age: 62
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }

    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Buy bottles',
    //         completed: false
    //     },
    //     {
    //         description: 'Buy diapers',
    //         completed: true
    //     },
    //     {
    //         description: 'Clean the balconies',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert tasks');
    //     }

    //     console.log(result.ops);
    // })


    // Read:

    // db.collection('users').findOne({_id: new ObjectID("60d1c483f21e5818403283e9")}, (error, user) => {
    //     if(error){
    //         return console.log('Unable to fetch user');
    //     }

    //     console.log(user);
    // })

    // db.collection('users').find({age: 32}).toArray((error, users)=>{
    //     if(error){
    //         return console.log('Unable to fetch users');
    //     }

    //     console.log(users);
    // })

    // db.collection('users').find({age: 32}).count((error, count) => {
    //     if(error){
    //         return console.log('Unable to fetch users');
    //     }

    //     console.log(count);
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("60d1e692eb13fe3a0ca85654") }, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to fetch task');
    //     }

    //     console.log(task);
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     if (error) {
    //         return console.log('Unable to fetch tasks');
    //     }

    //     console.log(tasks);
    // })

    // db.collection('tasks').find({ completed: false }).count((error, count) => {
    //     if (error) {
    //         return console.log('Unable to fetch the count of tasks');
    //     }

    //     console.log(count);
    // })

    // Update:

    // db.collection('users').updateOne({
    //     _id: new ObjectID("60d30f49739c364608ba300e")
    // }, {
    //     $inc: {
    //         age: 20
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // Delete:

    // db.collection('users').deleteMany({
    //     age: 24
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').deleteOne({
    //     description: 'Clean the balconies'
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })
})