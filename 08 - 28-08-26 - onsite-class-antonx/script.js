// console.log("l1 start")
// setTimeout(() => console.log("l1 : setTimeout"), 0);
// Promise.resolve().then(()=> console.log("l1 : Promise"))
// console.log("l1 : end")
// Question No : 01
// L1 : start 
// L1 : end
// L1 : promise
// L1 : setTimeout


console.log("l2 : start")
setTimeout(() => console.log("l2 timeout 1") ,0)
Promise.resolve()
.then(()=> console.log("l2 : promise 1"))
.then(()=> console.log("l2 : promise 2"))

setTimeout(() => console.log("l2 : timeout 2"), 0)
console.log("l2 : end")
// Question No : 01
// L2 : start 
// L2 : end 
// L2 : promise 1 
// L2 : promise 2 
// L2 : timeout 1
// L2 : timeout 2

async function asyncFn() {
    console.log("L3 : async fn start")
    await null;
    console.log("L3 : async fn end")
}
console.log("l3 : script start")
setTimeout(() => console.log("l2 : timeout 2"), 0)
asyncFn() // is this still in the call stack
Promise.resolve().then(()=> console.log("l1 : Promise"))
console.log("l3 : script end")



