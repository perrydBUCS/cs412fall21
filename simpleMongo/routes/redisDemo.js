const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');

const redis = require('redis');
const client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);


client.flushdb((err, success) => {
    if (err) {
        throw new Error(err)
    }
});

router.get('/wx/:inputValue', async (req, res, next) => {
    let city = req.params.inputValue;
//    let match = await existsAsync(city);
    if (await existsAsync(city)) {
        let cityData = await getAsync(city);
        let response = {
            cityData: cityData,
            cached: true
        }
        res.send(response);

    } else {
       let returnValueRaw = await fetch('https://postman-echo.com/get?test=' + req.params.inputValue);
//       let cityData = await returnValueRaw;
        let cityData = await returnValueRaw.json();
        await setAsync(city, JSON.stringify(cityData));
        let response = {
            cityData: cityData,
            cached: false
        }
        await expireAsync(city, 5);
        res.send(response)
    }
});


router.get('/find/:name', (req, res, next) => {
    const name = req.params.name;

    client.exists(name, (err, match) => {  //looks for key
        if (err) {
            throw new Error(err)
        }
        if (match) { //key exists, grab value
            client.get(name, (err, response) => {
                console.table(response);
                res.send(JSON.stringify(response + ' cached '))
            })

        } else {
            const reversedName = name.split('').reverse().join(''); //reverse the string
            client.set(name, reversedName, 'EX', 5, (err, response) => { //name = key, reversedName = value
                console.table(response);
                res.send(JSON.stringify(reversedName + ' not cached '))
            }) //closure // Promises //async/await
        }
    })
})

module.exports = router;
