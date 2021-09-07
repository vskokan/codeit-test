const con = require("./../models/database");
const bcrypt = require("bcrypt");

exports.createUser = (req, res) => {
  const user = req.body.user;

  const saltRounds = 10;

  bcrypt
    .hash(user.password, saltRounds)
    .then((hashedPassword) => {
      return con
        .promise()
        .query(
          "INSERT INTO users (login, email, password, real_name, birth_date, " +
            "registration_time, country) VALUES (?,?,?,?,?,?,?)",
          [
            user.login,
            user.email,
            hashedPassword,
            user.realName,
            user.birthDate,
            Date.now(),
            user.country,
          ]
        );
    })
    .then(() => {
      res.json({ login: true });
    })
    .catch((err) => {
      res.json({ login: false });
    })
};

exports.checkLoginForExistence = (req, res) => {
  con
    .promise()
    .query("SELECT EXISTS(SELECT * FROM users WHERE login = ?) AS isExist", [
      req.params.login,
    ])
    .then(([rows, fields]) => {
      !!rows[0].isExist
        ? res.json({ exist: true })
        : res.json({ exist: false });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.checkEmailForExistence = (req, res) => {
  con
    .promise()
    .query("SELECT EXISTS(SELECT * FROM users WHERE email = ?) AS isExist", [
      req.body.email,
    ])
    .then(([rows, fields]) => {
      !!rows[0].isExist
        ? res.json({ exist: true })
        : res.json({ exist: false });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.readOneUser = (req, res) => {
  con
    .promise()
    .query(
      'SELECT users.login, users.email, users.real_name AS realName, DATE_FORMAT(users.birth_date, "%M %d %Y") AS birthDate, ' +
        "users.registration_time AS registrationDate, countries.name AS country FROM users INNER JOIN countries " +
        " ON countries.id = users.country " +
        "WHERE users.login = ?",
      [req.params.login]
    )
    .then(([rows, fields]) => {
      res.json(rows[0]);
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Error" });
    })
};

exports.signIn = (req, res) => {
  let login = ''

  con
  .promise()
  .query(
    'SELECT login, password FROM users WHERE login = ? OR email = ?',
    [req.body.user.loginOrEmail, req.body.user.loginOrEmail]
  )
  .then(([rows, fields]) => {
   if (rows.length === 0) {
     res.json({logged: false, message: 'User does not exist'})
   } else {
    login = rows[0].login

    bcrypt.compare(req.body.user.password, rows[0].password)
    .then((result) => {
      if (result) {
        res.json({logged: true, login: login})
      } else {
        res.json({logged: false, message: 'Wrong password'})
      }
    })
    .catch((err) => {
      console.log(err)
    })
   }
  })
  .catch((err) =>{
    console.log(err)
  })
}
