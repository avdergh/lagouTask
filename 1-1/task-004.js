const STATUS_PENDING = 'pending'
const STATUS_RESOLVED = 'resolved'
const STATUS_REJECTED = 'rejected'


/**
 * 手写实现 MyPromise 源码，尽可能还原 Promise 中的每一个 API ，并用过注释的方式描述思路和原理。
 */
class MyPromise {
    status = STATUS_PENDING
    value = undefined
    reason = undefined
    callbacks = []

    constructor(excutor, callbacks = []) {
        //立即调用执行器
        try {
            this.callbacks = callbacks
            excutor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    resolve = value => {
        // 状态只能修改一下，如果状态不是padding，则停止向下执行
        if (this.status !== STATUS_PENDING) return;
        // 将MyPromise的状态修改为resolved
        this.status = STATUS_RESOLVED
        // 保存成功执行的返回值，提供给调用函数使用 
        this.value = value
        try {
            // 查看回调队列是非为空，不为空则执行队列里的回调函数
            if (this.callbacks.length > 0) {
                let result = this.callbacks.shift().successCallback(this.value)
                return MyPromise.resolve(result, this.callbacks)
            }
        } catch (e) {
            return MyPromise.reject(e, this.callbacks)
        }
    }

    reject = reason => {
        // 状态只能修改一下，如果状态不是padding，则停止向下执行
        if (this.status !== STATUS_PENDING) return;
        // 将MyPromise的状态修改为rejected
        this.status = STATUS_REJECTED
        // 保存失败执行的返回值，提供给调用函数使用 
        this.reason = reason
        try {
            // 查看回调队列是非为空，不为空则执行队列里的回调函数
            if (this.callbacks.length > 0) {
                let result = this.callbacks.shift().failCallback(this.reason)
                return MyPromise.reject(result, this.callbacks)
            }
        } catch (e) {
            return MyPromise.reject(e, this.callbacks)
        }
    }

    /**
     * 为MyPromise指定成功或失败的回调函数
     * @param successCallback MyPromise执行成功的回调函数
     * @param failCallback MyPromise执行失败的回调函数
     * @returns 一个新的MyPromise对象
     */
    then(successCallback, failCallback) {
        try {
            // 如果then()没有传递回调函数，则将value向下传递
            successCallback = successCallback ? successCallback : value => value
            failCallback = failCallback ? failCallback : reason => { throw reason }
            let result = undefined
            if (this.status === STATUS_RESOLVED) { // 状态为resolved，执行成功回调函数
                result = successCallback(this.value)
            } else if (this.status === STATUS_REJECTED) { // 状态为rejected，执行失败回调函数
                result = failCallback(this.reason)
            } else if (this.status === STATUS_PENDING) { // 状态为pending，将then()中的参数存入MyPromise的回调函数队列中
                this.callbacks.push({ successCallback, failCallback })
                return this
            }
            return MyPromise.resolve(result, this.callbacks)
        } catch (e) {
            return MyPromise.reject(e, this.callbacks)
        }
    }

    /**
     * 处理MyPromise的rejected的情况
     * @param failCallback MyPromise执行失败的回调函数
     * @returns 一个新的MyPromise对象
     */
    catch(failCallback) {
        return this.then(undefined, failCallback)
    }

    /**
     * 在promise结束时，无论结果是什么，都会执行指定的回调函数。
     * @param callback 始终都会执行的回调函数
     * @returns 一个新的MyPromise对象
     * @todo 未完成
     */
    finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }

    /**
     * 为value生成新的成功的MyPromise
     * 如果value为MyvaluePromise，直接返回value
     */
    static resolve(value, callbacks = []) {
        if (value instanceof MyPromise) return value;
        return new MyPromise((resolve, undefined) => { resolve(value) }, callbacks)
    }

    /**
     * 为reason生成新的失败的MyPromise
     * 如果value为MyvaluePromise，直接返回value
     */
    static reject(reason, callbacks = []) {
        if (reason instanceof MyPromise) return reason;
        return new MyPromise((undefined, reject) => { reject(reason) }, callbacks)
    }

    /**
     * 当iterable中的所有MyPromise都为resolved，生成一个新的成功MyPromise对象。
     * 成功的MyPromise对象包括iterable中的所有MyPromise的返回值，顺序和iterable一致。
     * 如果iterable中的有一个MyPromise为rejected，则生成一个新的失败MyPromise，失败信息为iterable中rejected状态的MyPromise的失败信息。
     * @param 一个MyPromise数组
     * @returns 一个新的MyPromise对象
     */
    static all(iterable) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index++;
                if (index === iterable.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < iterable.length; i++) {
                let current = iterable[i];
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), reason => reject(reason))
                } else {
                    addData(i, iterable[i]);
                }
            }
        })
    }

    /**
     * 返回iterable数组中第一个状态为完成的MyPromise对象,无论成功还是失败
     * @param 一个MyPromise数组
     * @returns 一个新的MyPromise对象
     */
    static race(iterable) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < iterable.length; i++) {
                let current = iterable[i];
                MyPromise.resolve(current).then(resolve, reject)
            }
        })
    }
}

module.exports = MyPromise