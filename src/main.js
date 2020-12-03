console.log('hello world')

function _alert (msg) {
  console.log(msg)
}

_alert('hello world')

function Person (name, no) {
  this.name = name
  this.no = no
}

const person = new Person('熊业昌', '0001')

console.log(person)
