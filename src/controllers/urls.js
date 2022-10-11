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

export { postUrl };
