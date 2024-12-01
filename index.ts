import { Client } from "pg";
import express from "express";

const port = 3000;
const app = express();
app.use(express.json());

const pgClient = new Client("");

pgClient.connect();

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const { city, country, street, pincode } = req.body;

  try {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2,$3) RETURNING id;`;

    const addressInsertQuery = `INSERT INTO users (city, country, street, pincode, user_id) VALUES ($1,$2,$3,$4,$5);`;

    await pgClient.query("BEGIN;");

    const response = await pgClient.query(insertQuery, [
      username,
      email,
      password,
    ]);

    const user_id = response.rows[0].id;

    const addressInsertQueryResponse = await pgClient.query(
      addressInsertQuery,
      [city, country, street, pincode, user_id]
    );

    await pgClient.query("COMMIT;");

    console.log(addressInsertQueryResponse);
    res.send("user created");
  } catch {
    res.send("error while signing up");
  }
});

app.get("/metadata", async (req, res) => {
  try {
    const { id } = req.body;
    const getUserMetaDataQuery = `SELECT username, email from users where id = $1`;
    const getAddressMetaDataQuery = `SELECT * FROM addresses where user_id =$1`;

    const userData = await pgClient.query(getUserMetaDataQuery, [id]);
    const addressesData = await pgClient.query(getAddressMetaDataQuery, [id]);

    res.json({
      user: userData.rows,
      addresses: addressesData.rows,
    });
  } catch (e) {}
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
