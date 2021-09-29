const request = require("request")

const doReq =  function () {
    return new Promise(function (resolve, reject) {
        const options = {
            method : 'GET',
            url: 'https://postman-echo.com/get',
            qs     : {test: '123'},
            headers: {
                'postman-token': '9bb9a22f-b509-6c7c-b716-cd4c3106ed0f',
                'cache-control': 'no-cache'
            }
        }

        request(options, function (error, response, body) {
            if (error)

                reject(new Error(error))
            else {
                resolve(body)
            }
        })
    })
}
console.log('start')
doReq() //hangs right here
    .then(function (body) {
        const value = JSON.parse(body).args.test
        console.log(value);
        console.log('done')

    },
        function (err) {
        console.log(`An error happened`);
})
    .catch(function(err) {
        console.log(`ERROR! ${err}`);
    });

console.log(`Waiting?`);
