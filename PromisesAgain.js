//Promises look a bit like callbacks
//


const P1 = new Promise(function (resolve, reject) {

    resolve(42);

});



// let P2 = P1.then((val) => {
//         console.log(`Received ${val} from P1`);
//         return val;
//     },
//     function (val) {
//         console.log(`Received ${val} from P1 on rejection`);
//     });

//See if default handler works (tldr; It does.)
//
let P2 = P1.then();
let P3 = P2.then( val => {
    console.log(`Val in P2: ${val}`);
    return( val*2);
});

P3.then(value => console.log(`Value in P3 is ${value}`))


