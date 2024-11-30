import { Client } from "pg";
import express from "express";

const port = 3000;
const app = express();
app.use(express.json());

const pgClient = new Client("");

pgClient.connect();

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2,$3);`;
    const response = await pgClient.query(insertQuery, [
      username,
      email,
      password,
    ]);

    res.send("user created");
  } catch {
    res.send("error while signing up");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
