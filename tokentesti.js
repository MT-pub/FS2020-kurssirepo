var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const SALT_ROUNDS = 12

let alku = Date.now()
let hashiShalasana
bcrypt.hash("kissa", SALT_ROUNDS, (err, hash) => {
  let loppu = Date.now()

  hashiShalasana = hash
  console.log(hash)
  console.log(loppu - alku)

  bcrypt.compare("kissa", hashiShalasana, (err, olikoOikein) => { console.log(olikoOikein) })


  // Store hash in your password DB.
});

(async () => {
  try {
    let hashattySalasana = await bcrypt.hash("kissa", SALT_ROUNDS)
    console.log(hashattySalasana)

    let result = await bcrypt.compare("kissa", hashattySalasana)
    console.log(result)
  } catch (e) {

  }
})();


/* var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
console.log("Alkuperäinen token ",token)
var token2 = token.substr(0, 8) + "o" + token.substr(9, token.length)
console.log("Manip. token ",token2)

try {
  let result = jwt.verify(token2, 'shhhhh')
  console.log(result)
} catch (e) {
  console.log("Token ei ole OK")
}
 */

