// 将下面异步代码使用 Promise 的方式改进
// setTimeout(function () {
//     var a = "hello"
//     setTimeout(function () {
//         var b = "lagou"
//         setTimeout(function () {
//             var c = "I ♥ U"
//             console.log(a + b + c)
//         }, 10)
//     }, 10)
// }, 10)

Promise.resolve('hello')
    .then(value => value + ' ' + 'lagou')
    .then(value => value + ' ' + 'I ♥ U')
    .then(console.log)