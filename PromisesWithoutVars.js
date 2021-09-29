//Promises look a bit like callbacks
//


const P1 = new Promise(function (resolve, reject) {
    throw new Error('This was thrown');
    reject(new Error('BAD DOG NO BISCUIT'));

})
    .catch((err => { console.log(`Error: ${err}`) })
);

P1.then((val) => {
        console.log(`Received ${val} from P1`);
       //return val;
    reject();
    },
    function (val) {
        console.log(`Received ${val} from P1 on rejection`);
        //return (88);
    })
    .then(value => console.log(`Value in P3 is ${value}`),
        err => console.log(`Rejected with ${err}`))
    .catch(err => { console.log(`Error: ${err}`) })



