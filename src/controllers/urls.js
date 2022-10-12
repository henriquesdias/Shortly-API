import { nanoid, customAlphabet } from "nanoid";

import connection from "../database/postgres.js";

async function postUrl(req, res) {
  const { url } = res.locals.body;
  const { token } = res.locals.token;
  const { userId } = res.locals.userId;
  try {
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 10);
    const shortUrl = nanoid(9);
    await connection.query(
      'INSERT INTO urls ("shortUrl", url, "userId", "visitCount") VALUES ($1, $2, $3, $4)',
      [shortUrl, url, userId, 0]
    );
    res.status(201).send({ shortUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const url = await connection.query(
      'SELECT id, "shortUrl", url  FROM urls WHERE id = $1',
      [id]
    );
    if (url.rowCount === 0) {
      return res.sendStatus(404);
    }
    res.status(200).send(url.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function redirectToUrl(req, res) {
  const { shortUrl } = req.params;
  try {
    const url = await connection.query(
      'SELECT * FROM urls WHERE "shortUrl" = $1',
      [shortUrl]
    );
    if (url.rowCount === 0) {
      return res.sendStatus(404);
    }
    const newVisitor = url.rows[0].visitCount + 1;
    await connection.query(
      'UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2',
      [newVisitor, shortUrl]
    );
    res.redirect(url.rows[0].url);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export { postUrl, getUrlById, redirectToUrl };
