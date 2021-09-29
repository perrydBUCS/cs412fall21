
const delayed = function ( callback ) {
    setTimeout(
        function () {
            console.log('in delayed')
            let x = 42
            callback(x)
        }, 2000)
}

console.log('starting run')
const x = delayed(function (x) {
    console.log('x has the value', x)
    }
)
secondFunction(5)
// let secondFunction;
function secondFunction(x) {
    console.log(`x is now ${x}`);
}
//const secondFunction = (x) => console.log('x is now', x)
console.log('ending run')
