const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database.config");
const {
  errorQuery,
  emptyData,
  successLoad,
  successSave,
} = require("../util/responseQuery.util");

exports.getAllTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    const allTransaction =
      "SELECT tb_transaction.id, tb_transaction.input_date, tb_transaction.item_id, tb_item.name AS item_name, tb_item.price AS item_price, tb_item.stock AS item_stock, tb_transaction.company_code, tb_company.name AS company_name FROM tb_transaction INNER JOIN tb_company ON tb_company.company_code = tb_transaction.company_code INNER JOIN tb_item ON tb_item.id = tb_transaction.item_id";
    const response = await client.query(allTransaction);

    if (response.rowCount === 0) {
      return emptyData(res);
    }

    successLoad(res, response.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "get all transaction", err);
  } finally {
    client.release();
  }
};

exports.getDetailTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
  } catch (err) {
    console.error(err);
    errorQuery(res, "get detail transaction", err);
  } finally {
    client.release();
  }
};

exports.addNewTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    // ambil data item
    const findItem = "SELECT id, name, price, stock FROM tb_item WHERE id = $1";
    const resFindItem = await client.query(findItem, [req.body.item_id]);

    if (resFindItem.rowCount === 0) {
      return emptyData(res);
    }

    if (resFindItem.rows[0].stock < req.body.item_count) {
      return res.status(400).send({
        message:
          "Jumlah stok yang dimasukkan tidak boleh melebihi stock barang",
      });
    }

    const newTransactionQry =
      "INSERT INTO tb_transaction(id, company_code, item_id, item_count, total, remaining_stock) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    const newTransactionPrm = [
      uuidv4(),
      req.body.company_code,
      req.body.item_id,
      req.body.item_count,
      resFindItem.rows[0].price * req.body.item_count,
      resFindItem.rows[0].stock - req.body.item_count,
    ];
    const resNewTransaction = await client.query(
      newTransactionQry,
      newTransactionPrm
    );

    const updateStockQry = "UPDATE tb_item SET stock = $1 WHERE id = $2";
    await client.query(updateStockQry, [
      resFindItem.rows[0].stock - req.body.item_count,
      req.body.item_id,
    ]);

    successSave(res, resNewTransaction.rows);
  } catch (err) {
    console.error(err);
    errorQuery(res, "add new transaction", err);
  } finally {
    client.release();
  }
};

exports.updateTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
  } catch (err) {
    console.error(err);
    errorQuery(res, "update transaction", err);
  } finally {
    client.release();
  }
};
