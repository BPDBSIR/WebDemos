
const pi = Math.PI * 2
console.log(pi)
const r = Math.random()
console.log(r)
console.log(pi * r)

function randBetween(min, max) {
  return Math.floor(Math.random() * max) + min;
}

for (let i = 0; i < 20; i++) {

  console.log(randBetween(10, 20));
}


console.log(Math.floor(Math.random()))
