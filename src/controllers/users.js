import connection from "../database/postgres.js";

import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

async function signUp(req, res) {
  const { name, email, password } = res.locals.body;
  try {
    const user = await connection.query(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );
    if (user.rowCount !== 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      "INSERT INTO users (name,email,password) VALUES ($1, $2, $3);",
      [name, email, bcrypt.hashSync(password, 10)]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function signIn(req, res) {
  const { email, password } = res.locals.body;
  try {
    const user = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (
      user.rowCount !== 0 &&
      bcrypt.compareSync(password, user.rows[0].password)
    ) {
      const token = nanoid();
      await connection.query(
        'INSERT INTO sessions ("userId", token) VALUES ($1, $2);',
        [user.rows[0].id, token]
      );
      return res.status(200).send({ token });
    }
    res.sendStatus(401);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { signUp, signIn };
