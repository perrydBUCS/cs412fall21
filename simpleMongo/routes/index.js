const express = require('express');
const router = express.Router();
const db = require('../mongoCx');

router.route('/')
    .get(async (req, res, next) => {  //GET maps to 'read' in REST
        //connect to db
        let mongo = await db.getDB('cs591')
        //do a search, return everything
        let results = await mongo.collection('peoples').find().toArray(); //returns everything
        //respond to client
        res.send(results);
    })

    // Let's look for a single item in the db, might see a few different ways to pass the params
    // http://localhost:3000?name=Fred  -- query string, name is on req.params
    // http://localhost:3000/Fred/MA/BU/  -- param is on URL

    .post(async (req, res, next) => {    //POST maps to 'create' in REST


        //connect to db
        let mongo = await db.getDB('cs591');
        //insert a record
        //grab field info from form (method 1):
        //let userName = req.body.userName;
        //let results = await mongo.collection('peoples').insert({name: userName, department: 'BUCS'})

        //grab field info from form (method 2):
        //just kidding, there is no method 2, just use req.body as long as form field names = db field names

        let results =  await mongo.collection('peoples').insert(req.body)

//        res.send(results);
        res.send(`Inserted ${req.body.name}`)
    })
router.get('/login', (req, res, next) => {
    //is this route active?  No, order matters (routes are parsed top to bottom)
    console.log(`Redirecting`);
    res.redirect('http://localhost:3000/billy')
//    res.send('logged in')
    
})

//localhost:3000/Bob
router.get('/:name', async (req, res, next) => {  //'name' is a bare param, but Express assigns it to req.params.name
    let mongo = await db.getDB('cs591');
    //do a search, return matching item
    let results = await mongo.collection('peoples').findOne({name: req.params.name}, {name: 1, _id: 0}); //returns matching item
    res.send(`Found ${JSON.stringify(results)}`)
})


module.exports = router;

//flush in-memory (cached) objects to disk
