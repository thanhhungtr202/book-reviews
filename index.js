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

//Could use axios to get images then store them in html code and send that over as an arr
app.get("/", async (req, res)=>{
    try {
        const result = await db.query("SELECT * FROM books ORDER BY date_read DESC");
        const books_result = result.rows;
        res.render("index.ejs", {books: books_result});
    } catch (error) {
        console.log(error);
    }
});

app.post("/edit", async (req, res)=>{
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [req.body.bookId]);
        const book_result = result.rows;
        res.render("edit.ejs", {books: book_result[0]});
    } catch (error) {
        console.log(error);
    }
});

app.post("/editConfirm", async (req, res)=>{
    try {
        await db.query("UPDATE books SET title = $1, author = $2, short_des = $3 WHERE id = $4", [req.body.title, req.body.author, req.body.description, req.body.bookId]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.post("/delete", async (req, res)=>{
    try {
        await db.query("DELETE FROM books WHERE id = $1", [req.body.bookId]);
        res.redirect("/");
    } catch (error) {
        
    }
});

app.get("/new", (req, res)=>{
    res.render("new.ejs");
})

app.post("/new", async (req, res)=>{
    try {
        const data = req.body;
        await db.query("INSERT INTO books (title, author, date_read, isbn, score, short_des) VALUES ($1, $2, $3, $4, $5, $6)", [data.title, data.author, data.date, data.isbn, data.score, data.description]);
        res.redirect("/");
    } catch (error) {
        
    }
})

app.post("/search", async (req, res)=>{
    try {
        const result = await db.query("SELECT * FROM books WHERE LOWER(title) LIKE '%' || $1 || '%' ORDER BY date_read DESC", [req.body.title.toLowerCase()]);
        const books_result = result.rows;
        res.render("index.ejs", {books: books_result});
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, (req, res)=>{
    console.log(`App running on port ${port}`);
});