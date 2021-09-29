/*
 Small demo to show chaining of API calls. We're using these APIs:
 https://weathers.co for current weather in 3 cities, and
 https://api.github.com/search/repositories?q=<term> to search GitHub repos for
 the 'hottest' city. For example, we'll grab weather for 3 cities, pick the hottest one,
 then hit GitHub with a search for repos that have that city's name. A bit nonsensical
 but I just wanted to demonstrate using the results of one API call to populate a second.

 The problem we're trying to solve is that the API calls are asynch, and one of them
 (getCityTemperatures) loops through several asynch calls (one for each city), and they
 all have to complete before we go to the next step.

 */
"use strict";

const express = require('express')
const router = express.Router()

/*
 request-promise-lite is a smaller version of the request-promise library. The 'regular' request
 package does not return Promises; several wrapper packages (like RPL) add native
 Promises so that we can chain them.
 The async package provides quite a few methods for managing asynchronous calls. We're
 using async.waterfall here which runs a series of functions in order, passing results
 to each one in turn
 */
const request = require('request-promise-lite')
const async = require('async')

/*
 Only one route (http://localhost:3000/rp) for this demo. All this route does is log
 a message to the console and then start the asynchronous waterfall. The signature
 for async.waterfall is ([array of functions in order], final function (optional))

 In the waterfall, each function is passed a callback to the next function in the line,
 so in each function the last thing to do is call the callback, which expects an error
 object (which is null if there are no errors to report) and one or more parameters
 to hand to the next function.

 Once all three functions are done, a final function renders a Pug page with a simple table
 of results. That last function (function (err, result, city)) is called from the final function
 in the waterfall (findGitHubRepos), and then we just render a Pug page with the information.
 */

router.route('/')
    .get(function (req, res, next) {
        console.log('Starting waterfall')
        async.waterfall([getCityTemperatures, getHottestCity, findGitHubRepos],
            function renderTable(err, result, city) {
                if (err) {
                    res.render('gitHot', {result: 'Error processing'})
                }
                else {

                    res.render('gitHot', {result: result, city: city})
                }
            })
    })

/*
 getCityTemperatures calls the weathers.co API for each city in a hardcoded array. This is the
 first function in the waterfall and so it receives only one param, the callback (cb).

 This is the most interesting function of the three because it has to do an API call for
 each city in the array, and they all are asynchronous. We can't return from the function
 until all of the city weather has been collected.

 In each API call, once the current temperature is known it is plugged into the city's object
 in the array. (Note that weathers.co doesn't always return the actual current temperature.
 Often it is a cached value.)

 The technique here is to create a Promise that encompasses the API calls. That's the first
 'return new Promise()' at the top of the function. A SECOND Promise is set up in the local function getWeather,
 and that's the one that does each city's API call. request.get() itself returns a Promise (because
 we are using the request-promise-lite package), and so we make the request.get() and follow
 it with a .then() which will run when the API call returns. The resolve() at the end of the .then()
 gets us out of this inner Promise and on to the next one. Note that we don't initially execute getWeather(),
 we're just defining it.
 */
const getCityTemperatures = function (cb) {
    return new Promise(function (resolve, reject) {
        const weatherURL = 'https://weathers.co/api.php?city='
        let cities = [
            {name: 'Miami', temperature: null},
            {name: 'Atlanta', temperature: null},
            {name: 'Boston', temperature: null}
        ]
        let getWeather = function (city) {
            return new Promise(function (resolve, reject) {
                request.get(weatherURL + city.name, {json: true})
                    .then(function (response) {
                        city.temperature = response.data.temperature
                        console.log(city.name, city.temperature)
                        resolve()
                    })

            })
        }
        /*
         Now that we have a function wrapped in a Promise (getWeather), we want to
         run the function on each city in the array. The Array.map() method is a
         handy way to do this...it is saying that for each city, set up the function call,
         passing in the name of the city. Note that we're still not running the API calls,
         the map just sets everything up.
         */
        console.log('Starting temperature loop')
        let cityPromises = cities.map(getWeather)

        /*
         Ok, NOW we can run the API calls. Promise.all() takes the functional map
         we just created and executes each function in it. They are all Promises, and
         Promise.all()will not resolve until all of them are done (or one throws an error).
         Once all are complete, the .then() function runs the callback that was passed in
         at the top. We want to send the array of city objects (now with actual temperatures)
         to the next function in the chain, keeping in mind that the first returned param is
         an error object (set here to null). The cities variable gets passed to getHottestCity,
         which is  next in the waterfall.
         */
        Promise.all(cityPromises)
            .then(function () {
                cb(null, cities) //null means no error
            })
            .catch(function (err) {
                console.log(err)
            })

    })
}

/*
 getCityTemperatures returns an array of city objects, which is passed to getHottestCity along
 with a callback to the next function in the waterfall. Not much going on here, we just want
 to find the hottest city in the array and pass it along to the next function through the callback.
 */
const getHottestCity = function (cities, cb) {
    console.log('Finding hottest city')
    //Get a slice with just temperatures and find the largest
    let largestTemperature = Math.max(...Array.from(cities, city => city.temperature))

    //Find the object in the array that has that largest temperature
    let hottestCity = cities.find(city => city.temperature == largestTemperature)

    console.log('Hottest city?', hottestCity.name)

    //Pass the hot one to the next function
    cb(null, hottestCity)
}

/*
 Now that we know which city is hottest, it is passed into findGitHubRepos (and
 of course we are given a callback to call at the end). This API is pretty simple,
 it just does a search for repos that have the string passed as the query string.
 GitHub requires a User-Agent header, and that is set as an option in request.get().
 The request returns a Promise and so is thenable, so we make the call, and when the
 results are ready an object is created for each item in the response (there are 30
 by default) with a few interesting bits of information. These are pushed onto an
 array that we'll return.
 */
const findGitHubRepos = function (city, cb) {
    console.log('Looking at GitHub for', city.name)
    let resultArray = []
    let GitHubSearchURL = 'http://api.github.com/search/repositories?q='
    request.get(GitHubSearchURL + city.name, {
        json: true, headers: {
            'User-Agent': 'yourname'
        }
    })
        .then(function (response) {
            response.items.forEach(function (item) {
                let gitInfo = {
                    description: item.description,
                    fullName: item.full_name,
                    url: item.url
                }
                resultArray.push(gitInfo)
            })

            cb(null, resultArray, city)
        })

}

module.exports = router
