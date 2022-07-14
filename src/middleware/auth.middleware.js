const jwt = require("jsonwebtoken");
const { pool } = require("../config/database.config");
const { errorRole, errorQuery } = require("../util/responseQuery.util");
require("dotenv").config();

const jwt_access = process.env.JWT_ACCESS;

exports.auth = async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(403).send({ message: "Access denied" });

  try {
    if (token.startsWith("Bearer ")) {
      // hapus Bearer dari string sehingga tinggal tokennya saja
      token = token.slice(7, token.length).trimLeft();
    }

    jwt.verify(token, jwt_access, async (err, user) => {
      console.log("User terautentikasi ===>", user);
      if (!err) {
        req.user = user;

        next();
      } else if (err.message === "jwt expired") {
        return res.status(401).send({
          message: "Access token expired",
        });
      } else {
        return res.status(403).send({
          message: "User tidak terautentikasi",
        });
      }
    });
  } catch (err) {
    console.log("Error report ==> ", err);

    res.status(400).send({
      error: {
        message: "Invalid token",
      },
    });
  }
};

exports.adminAuth = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const getRoleQry = "SELECT role FROM tb_user WHERE email = $1";
    const getRolePrm = [req.user.email];

    const results = await client.query(getRoleQry, getRolePrm);

    if (results.rows[0].role === "admin") {
      next();
    } else {
      errorRole("admin", res);
    }
  } catch (err) {
    console.error(err);
    errorQuery(res, "auth admin", err);
  } finally {
    client.release();
  }
};
