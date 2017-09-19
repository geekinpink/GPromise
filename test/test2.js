import GPromise from '../GPromise.js'

function async1() {
    return new GPromise(
        (resolve, reject) => {
            console.log('async1 start');
            setTimeout(() => {
                resolve('async1 finished')
            }, 1000);
        }
    );
}

function async2() {
    return new GPromise(
        (resolve, reject) => {
            console.log('async2 start');
            setTimeout(() => {
                resolve('async2 finished')
            }, 1000);
        }
    );
}

function async3() {
    return new GPromise(
        (resolve, reject) => {
            console.log('async3 start');
            setTimeout(() => {
                resolve('async3 finished');
            }, 1000);
        }
    );
}

async1()
    .then(
        data => {
            console.log(data);
            return async2();
        })
    .then(
        data => {
            console.log(data);
            return async3();
        }
    )
    .then(
        data => {
            console.log(data);
        }
    );