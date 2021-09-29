
const delayed = function ( ) {
    console.log(`In delay`);
    setTimeout(
        function () {
            let x = 42
            console.log(`Out of delay`);
            return x
        }, 2000)
}

const recurs = function (value) {
    console.log(`In recursion`);
    if (!value) {
        console.log(`OUt of recursion`);
        return;}

    if (value) recurs(value - 1);

}

recurs(10000);
delayed();
console.log(`Done for reals`);

