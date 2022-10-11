import connection from "../database/postgres.js";

async function validateTokenFromUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);
  try {
    const session = await connection.query(
      "SELECT * FROM sessions WHERE token = $1",
      [token]
    );
    if (session.rowCount === 0) {
      return res.sendStatus(401);
    }
    res.locals.userId = { userId: session.rows[0].userId };
    res.locals.token = { token };
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { validateTokenFromUser };
