// const { expressjwt: expressJwt } = require("express-jwt");
// const secret = process.env.JWT_SECRET || "marvtheGOAT";
// function authJwt() {
//   const api = "/api/v1";
//   return expressJwt({
//     secret,
//     algorithms: ["HS256"],
//     isRevoked: isRevoked,
//   }).unless({
//     path: [
//       { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
//       { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
//       `${api}/users/login`,
//       `${api}/users/register`,
//     ],
//   });
// }
// async function isRevoked(req, tokenPayload, done) {
//   try {
//     console.log(done);
//     console.log(tokenPayload);
//     console.log(tokenPayload.payload.isAdmin); // Verify the payload content
//     if (!tokenPayload.payload.isAdmin) {
//       return done(null, true); // Revoke the token if the user is not an admin
//     }
//     return done(null, false); // Allow the token if the user is an admin
//   } catch (err) {
//     return done(err); // Pass any errors to express-jwt
//   }
// }
const { expressjwt: expressJwt } = require("express-jwt"); // Note: the 'expressjwt' name in v7
const secret = process.env.JWT_SECRET || "marvtheGOAT";

function authJwt() {
  const api = "/api/v1";
  return expressJwt({
    secret: async () => secret, // Must be a function returning the secret
    algorithms: ["HS256"],
    isRevoked: isRevoked, // This now returns a promise
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, tokenPayload) {
  // No 'done' callback, must return a Promise
  if (!tokenPayload.payload.isAdmin) {
    return true; // Revoke the token if the user is not an admin
  }
  return false; // Allow the token if the user is an admin
}

module.exports = authJwt;
