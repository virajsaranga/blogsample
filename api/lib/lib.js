const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}
//admin
function issueAdminJWT(admin) {
  const expiresIn = "2w";

  const payload = {
    sub: {
      id: admin.id,
      admin_name: admin.admin_name,
      email: admin.email,
      status: "ADMIN",
    },
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_SECRET_TOKEN,
    { expiresIn: expiresIn }
  );

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: admin.id,
      admin_name: admin.admin_name,
      email: admin.email,
    },
  };
}
function adminAuthMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(" ");

    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      try {
        const verification = jsonwebtoken.verify(
          tokenParts[1],
          process.env.ACCESS_SECRET_TOKEN
        );
        if (verification.sub.status === "ADMIN") {
          req.jwt = verification;
          next();
        } else {
          res
            .status(210)
            .json({
              success: false,
              code: 210,
              status: "Unauthorized",
              msg: "You are not an admin",
            });
        }
      } catch (err) {
        res
          .status(210)
          .json({
            success: false,
            code: 210,
            status: "Unauthorized",
            msg: "You are not authorized to visit this route",
          });
      }
    } else {
      res
        .status(210)
        .json({
          success: false,
          code: 210,
          status: "Unauthorized",
          msg: "You are not authorized to visit this route",
        });
    }
  } else {
    res
      .status(210)
      .json({
        success: false,
        code: 210,
        status: "TokenError",
        msg: "You are not authorized to visit this route",
      });
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueAdminJWT = issueAdminJWT;
module.exports.adminAuthMiddleware = adminAuthMiddleware;
