import { customAlphabet } from "nanoid";

import connection from "../database/postgres.js";

async function postUrl(req, res) {
  const { url } = res.locals.body;
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
async function deleteUrl(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.userId;
  try {
    const url = await connection.query("SELECT * FROM urls WHERE id = $1", [
      id,
    ]);
    if (url.rowCount === 0) {
      return res.sendStatus(404);
    }
    if (url.rows[0].userId !== userId) {
      return res.sendStatus(401);
    }
    await connection.query("DELETE FROM urls WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
  return;
}
async function getUrlsFromASingleUser(req, res) {
  const { userId } = res.locals.userId;
  try {
    const user = await connection.query(
      "SELECT users.id, users.name FROM users WHERE users.id = $1;",
      [userId]
    );
    const urls = await connection.query(
      'SELECT id, "shortUrl", url, "visitCount" FROM urls WHERE "userId" = $1;',
      [userId]
    );
    let allVisits = 0;
    if (urls.rowCount !== 0) {
      allVisits = urls.rows.reduce(
        (total, value) => total + value.visitCount,
        0
      );
    }
    const allUrls = {
      id: user.rows[0].id,
      name: user.rows[0].name,
      visitCount: allVisits,
      shortenedUrls: [...urls.rows],
    };
    res.status(200).send(allUrls);
  } catch (error) {
    res.status(500).send(error.message);
  }
  return;
}
async function getRanking(req, res) {
  try {
    const ranking = await connection.query(
      'SELECT users.id, users.name, COALESCE(COUNT(url),0)  AS "linksCount",COALESCE(SUM("visitCount"),0) AS "visitCount" FROM users LEFT JOIN urls ON users.id = urls."userId" GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;'
    );
    res.status(200).send(ranking.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export {
  postUrl,
  getUrlById,
  redirectToUrl,
  deleteUrl,
  getUrlsFromASingleUser,
  getRanking,
};
