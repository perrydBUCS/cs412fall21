const express = require('express');
const router = express.Router();

const redis = require('redis');
const client = redis.createClient();

client.on("error", function (error) {
    console.error(error);
});

/* GET home page. */
router.post('/getsomething', function (req, res, next) {
let name = req.body.user_input;

    //grab a string off of the req
    const theString = req.query.theString;

    //see if the reversed string is in cache (redis)
    client.exists(theString, (err, response) => {
        if (err) {
            console.log(err);
            throw new Error(err)
        }
        if (response === 1) {
            client.get(theString, (err, revString) => {
              console.log(`revString: ${revString}`)
                res.render('index', {title: revString, cached: 'true'});
            })
        } else {
            const revString = theString.split('').reverse().join('');
            client.set(theString, revString, (err, response) => {
                console.table(response)
              res.render('index', {title: revString, cached: 'false'});

            })
        }
    })

});

module.exports = router;


// get it working, get it right, get it fast
