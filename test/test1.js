import GPromise from '../GPromise.js'

var promiseCount = 0;

/**
 * @params{isPromise}  true 为测试原生 Promise，false 测试 GPromise
 */
function test(isPromise) {
    let thisPromiseCount = ++promiseCount,
        executor = (resolve, reject) => {
            console.log(thisPromiseCount + ') Promise started (Async code started)');
            window.setTimeout(
                function () {
                    resolve(thisPromiseCount);
                }, Math.random() * 2000 + 1000);
        };

    console.log(thisPromiseCount + ') Started (Sync code started)');

    let p1 = isPromise ? new Promise(executor) : new GPromise(executor);

    p1.then(
        function (val) {
            console.log(val + ') Promise fulfilled (Async code terminated)');
        },
        function (reason) {
            console.log('Handle rejected promise (' + reason + ') here.');
        });

    console.log(thisPromiseCount + ') Promise made (Sync code terminated)');
}
test();
test(true);
test()