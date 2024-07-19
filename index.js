import express from "express"
import pg from "pg"
import axios from "axios"
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "Utrt@2002",
    port: 5432,
});

db.connect();

app.get("/", async (req, res)=>{
    const result = await db.query("SELECT * FROM books");
    const books_result = result.rows;
    res.render("index.ejs", {books: books_result});
});

app.post("/edit", async (req, res)=>{
    console.log(req.body.bookId);
});

app.post("/delete", async (req, res)=>{
    console.log(req.body.bookId);
});

app.listen(port, (req, res)=>{
    console.log(`App running on port ${port}`);
});