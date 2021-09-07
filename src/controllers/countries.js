const con = require("./../models/database");

exports.readCountries = (req, res) => {
  con
    .promise()
    .query("SELECT * FROM countries")
    .then(([rows, fields]) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err)
    })
};
