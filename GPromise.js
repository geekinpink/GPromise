class GPromise {
    constructor(executor) {
        this._promiseStatus = GPromise.PENDING;
        this._promiseValue;

        this.execute(executor);
    }

    execute(executor) {
        if (typeof executor != 'function') {
            throw new Error(`Promise resolver ${executor} is not a function`);
        }
        //捕获错误
        try {
            executor(data => {
                this._promiseStatus = GPromise.FULFILLED;
                this._promiseValue = data;
            }, data => {
                this._promiseStatus = GPromise.REJECTED;
                this._promiseValue = data;
            });
        } catch (e) {
            this._promiseStatus = GPromise.REJECTED;
            this._promiseValue = e;
        }
    }

    then(onfulfilled, onrejected) {
        let _ref = null,
            timer = null,
            result = new GPromise(() => {});

        //因为 promise 的 executor 是异步操作,需要监听 promise 对象状态变化，并且不能阻塞线程
        timer = setInterval(() => {
            if ((typeof onfulfilled == 'function' && this._promiseStatus == GPromise.FULFILLED) ||
                (typeof onrejected == 'function' && this._promiseStatus == GPromise.REJECTED)) {
                //状态发生变化，取消监听
                clearInterval(timer);
                //捕获传入 then 中的回调的错误，交给 then 返回的 promise 处理
                try {
                    if (this._promiseStatus == GPromise.FULFILLED) {
                        _ref = onfulfilled(this._promiseValue);
                    } else {
                        _ref = onrejected(this._promiseValue);
                    }

                    //根据回调的返回值来决定 then 返回的 GPromise 实例的状态
                    if (_ref instanceof GPromise) {
                        //如果回调函数中返回的是 GPromise 实例，那么需要监听其状态变化，返回新实例的状态是根据其变化相应的
                        timer = setInterval(() => {
                            if (_ref._promiseStatus == GPromise.FULFILLED ||
                                _ref._promiseStatus == GPromise.REJECTED) {
                                clearInterval(timer);
                                result._promiseValue = _ref._promiseValue;
                                result._promiseStatus = _ref._promiseStatus;
                            }
                        }, 0);

                    } else {
                        //如果返回的是非 GPromise 实例
                        result._promiseValue = _ref;
                        result._promiseStatus = GPromise.FULFILLED;
                    }
                } catch (e) {
                    //回调中抛出错误的情况
                    result._promiseStatus = GPromise.REJECTED;
                    result._promiseValue = e;
                }
            }
        }, 0);
        //promise 之所以能够链式操作，因为返回了GPromise对象
        return result;
    }
}

GPromise.PENDING = 'pending';
GPromise.FULFILLED = 'resolved';
GPromise.REJECTED = 'rejected';

export default GPromise;