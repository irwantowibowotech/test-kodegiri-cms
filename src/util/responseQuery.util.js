const successLoad = (res, data) => {
  return res.send({
    message: "Data berhasil diload",
    data: data,
  });
};

const successSave = (res, data) => {
  return res.status(201).send({
    message: "Data berhasil disimpan",
    data: data,
  });
};

const successUpdate = (res, data) => {
  return res.status(200).send({
    message: "Data berhasil diupdate",
    data: data,
  });
};

const successDelete = (res) => {
  return res.send({
    message: "Data berhasil dihapus",
  });
};

const emptyData = (res) => {
  return res.send({
    message: "Data tidak ada / tidak ditemukan",
  });
};

const errorQuery = (res, qry, err) => {
  return res.status(400).send({
    message: `Terjadi kesalahan saat melakukan query ${qry}`,
    error: err,
  });
};

const errorRole = (type, res) => {
  return res.status(401).send({
    message: `Kamu harus login sebagai ${type}`,
  });
};

module.exports = {
  successLoad,
  emptyData,
  errorQuery,
  successSave,
  successUpdate,
  successDelete,
  errorRole,
};
