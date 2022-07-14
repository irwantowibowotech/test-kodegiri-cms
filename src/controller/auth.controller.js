require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database.config");
const { errorQuery, emptyData } = require("../util/responseQuery.util");
const jwtAccess = process.env.JWT_ACCESS;

/**
 * Register new user
 * @method POST
 * @param {user.name, user.emai, user.pass}
 */
exports.register = async (req, res) => {
  const user = req.body.user;

  const client = await pool.connect();

  try {
    const findUserQry = "SELECT email FROM tb_user WHERE email = $1";
    const resFindUser = await client.query(findUserQry, [user.email]);

    if (resFindUser.rowCount > 0) {
      return res.status(409).send({
        message: "Data sudah ada, silahkan register dengan akun yang lain",
      });
    }

    let saltStrength = 10;

    // encrypt password
    const encryptPass = await bcrypt.hash(user.password, saltStrength);

    // save data
    const userSaveQry =
      "INSERT INTO tb_user(id, name, email, username, password, role) VALUES($1, $2, $3, $4, $5, $6)";
    const userSavePrm = [
      uuidv4(),
      user.name,
      user.email,
      user.username,
      encryptPass,
      !user.role ? "user" : user.role,
    ];
    await client.query(userSaveQry, userSavePrm);

    return res.status(200).send({
      message: "Register sukses",
    });
  } catch (err) {
    console.error(err);
    return errorQuery(res, "register user", err);
  } finally {
    client.release();
  }
};

/**
 * Login user
 * @method POST
 * @param {user.username, user.pass}
 */
exports.login = async (req, res) => {
  const user = req.body.user;
  const client = await pool.connect();

  try {
    // checking email into database
    const selectUserQry =
      "SELECT id, name, email, username, password, role FROM tb_user WHERE username = $1";
    const response = await client.query(selectUserQry, [user.username]);

    if (response.rowCount === 0) {
      return res.send({
        message: "email / password tidak sesuai",
      });
    }

    const resComparePassword = await passwordCompare(
      user.password,
      response.rows[0].password
    );

    if (resComparePassword) {
      const token = {
        id: response.rows[0].id,
        email: response.rows[0].email,
        name: response.rows[0].name,
        username: response.rows[0].username,
        role: response.rows[0].role,
      };

      // create token
      const accessToken = jwt.sign(token, jwtAccess, {
        expiresIn: "1d",
      });

      // send response
      return res.send({
        message: "Login berhasil",
        data: {
          user: {
            id: response.rows[0].id,
            email: response.rows[0].email,
            username: response.rows[0].username,
            name: response.rows[0].name,
            role: response.rows[0].role,
            accessToken: accessToken,
          },
        },
      });
    } else {
      return res.send({
        message: "email / password tidak sesuai",
      });
    }
  } catch (err) {
    console.error(err);
    return errorQuery(res, "login user", err);
  } finally {
    client.release();
  }
};

function passwordCompare(enteredPassword, passowrdInDb) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(enteredPassword, passowrdInDb, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}
