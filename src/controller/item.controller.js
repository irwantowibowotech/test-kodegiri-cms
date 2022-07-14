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

exports.getAllItem = async (_, res) => {
  const client = await pool.connect();

  try {
    const itemQry = "SELECT id, name, price, stock FROM tb_item";
    const response = await client.query(itemQry);

    if (response.rowCount === 0) {
      return emptyData(res);
    }

    successLoad(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "get all item", err);
  } finally {
    client.release();
  }
};

exports.getDetailItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const detailItemQry =
      "SELECT id, name, price, stock FROM tb_item WHERE id = $1";
    const response = await client.query(detailItemQry, [req.params.id]);

    if (response.rowCount === 0) {
      return emptyData(res);
    }

    successLoad(res, response.rows[0]);
  } catch (err) {
    console.error(err);
    errorQuery(res, "get detail item", err);
  } finally {
    client.release();
  }
};

exports.addNewItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const newItemQry =
      "INSERT INTO tb_item(id, name, price, stock) VALUES($1, $2, $3, $4) RETURNING id, name, price, stock";
    const newItemPrm = [
      uuidv4(),
      req.body.name,
      req.body.price,
      req.body.stock,
    ];

    const response = await client.query(newItemQry, newItemPrm);

    successSave(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "add new item", err);
  } finally {
    client.release();
  }
};

exports.updateItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const findData = await client.query(
      "SELECT id, name, price, stock FROM tb_item WHERE id = $1",
      [req.params.id]
    );
    if (findData.rowCount === 0) {
      return emptyData(res);
    }

    const updateItemQry =
      "UPDATE tb_item SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING id, nname, price, stock";
    const response = await client.query(updateItemQry, [
      req.body.name,
      req.body.price,
      req.body.stock,
      req.params.id,
    ]);

    successUpdate(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "update item", err);
  } finally {
    client.release();
  }
};

exports.deleteItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const findData = await client.query(
      "SELECT id, name FROM tb_item WHERE id = $1",
      [req.params.id]
    );
    if (findData.rowCount === 0) {
      return emptyData(res);
    }

    const deleteLocQry = "DELETE FROM tb_item WHERE id = $1";
    await client.query(deleteLocQry, [req.params.id]);

    successDelete(res);
  } catch (err) {
    console.error(err);
    errorQuery(res, "remove item", err);
  } finally {
    client.release();
  }
};
