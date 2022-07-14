const { pool } = require("../config/database.config");
const { v4: uuidv4 } = require("uuid");
const {
  errorQuery,
  emptyData,
  successLoad,
  successUpdate,
  successDelete,
  successSave,
} = require("../util/responseQuery.util");

exports.getAllCompany = async (_, res) => {
  const client = await pool.connect();

  try {
    const companyQry = "SELECT id, company_code, name FROM tb_company";
    const response = await client.query(companyQry);

    if (response.rowCount === 0) {
      return emptyData(res);
    }

    successLoad(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "get all company", err);
  } finally {
    client.release();
  }
};

exports.getDetailCompany = async (req, res) => {
  const client = await pool.connect();

  try {
    const detailComQry =
      "SELECT id, company_code, name FROM tb_company WHERE id = $1";
    const response = await client.query(detailComQry, [req.params.id]);

    if (response.rowCount === 0) {
      return emptyData(res);
    }

    successLoad(res, response.rows[0]);
  } catch (err) {
    console.error(err);
    errorQuery(res, "get detail company", err);
  } finally {
    client.release();
  }
};

exports.addNewCompany = async (req, res) => {
  const client = await pool.connect();

  try {
    if (findCodeCompany !== 0) {
      return res.status(409).send({
        message: "Code Company sudah ada, masukkan kode lain",
      });
    }
    const newComQry =
      "INSERT INTO tb_company(id, company_code, name) VALUES($1, $2, $3) RETURNING id, company_code, name";
    const newComPrm = [uuidv4(), req.body.company_code, req.body.name];

    const response = await client.query(newComQry, newComPrm);

    successSave(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "add new company", err);
  } finally {
    client.release();
  }
};

exports.updateCompany = async (req, res) => {
  const client = await pool.connect();

  try {
    const findData = await client.query(
      "SELECT id, company_code, name FROM tb_company WHERE id = $1",
      [req.params.id]
    );
    if (findData.rowCount === 0) {
      return emptyData(res);
    }

    const updateComQry =
      "UPDATE tb_company SET company_code = $1, name = $2 WHERE id = $3 RETURNING id, company_code, name, updatedat";
    const response = await client.query(updateLocQry, [
      req.body.company_code,
      req.body.name,
      req.params.id,
    ]);

    successUpdate(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "update company", err);
  } finally {
    client.release();
  }
};

exports.deleteCompany = async (req, res) => {
  const client = await pool.connect();

  try {
    const findData = await client.query(
      "SELECT id, name FROM tb_company WHERE id = $1",
      [req.params.id]
    );
    if (findData.rowCount === 0) {
      return emptyData(res);
    }

    const deleteLocQry = "DELETE FROM tb_company WHERE id = $1";
    await client.query(deleteLocQry, [req.params.id]);

    successDelete(res);
  } catch (err) {
    console.error(err);
    errorQuery(res, "remove company", err);
  } finally {
    client.release();
  }
};

async function findCodeCompany(code) {
  const client = await pool.connect();

  const response = await client.query(
    "SELECT id, company_code FROM tb_company WHERE code_company = $1",
    [code]
  );

  return response.rowCount;
}
