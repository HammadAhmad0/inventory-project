const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ===== CONNECT TO RAILWAY CLOUD DATABASE ===== */
const db = mysql.createConnection({
    host: "gondola.proxy.rlwy.net",
    user: "root",
    password: "aMOzcjdcGvPloIKcBKMItKegdcacpcTR",
    database: "railway",
    port: 11777
});

db.connect(err => {
    if(err){
        console.log("DB CONNECTION ERROR:", err);
    } else {
        console.log("Connected to Railway MySQL");
    }
});


// -------------------- GET CATEGORIES --------------------
app.get("/categories",(req,res)=>{
    db.query("SELECT * FROM categories",(err,result)=>{
        if(err) res.status(500).send(err);
        else res.json(result);
    });
});


// -------------------- GET USERS --------------------
app.get("/users",(req,res)=>{
    db.query("SELECT * FROM users",(err,result)=>{
        if(err) res.status(500).send(err);
        else res.json(result);
    });
});


// -------------------- GET ALL ITEMS --------------------
app.get("/items",(req,res)=>{

    db.query(`
        SELECT 
        i.item_id,
        i.item_name,
        c.category_name,
        i.quantity,
        DATE(i.expiry_date) AS expiry_date,
        u.name AS added_by
        FROM items i
        JOIN categories c ON i.category_id=c.category_id
        JOIN users u ON i.added_by=u.user_id
    `,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });

});


// -------------------- ADD ITEM --------------------
app.post("/addItem",(req,res)=>{

    const { item_name, category_id, quantity, expiry_date, added_by } = req.body;

    const sql=`
        INSERT INTO items
        (item_name,category_id,quantity,expiry_date,added_by)
        VALUES (?,?,?,?,?)
    `;

    db.query(sql,[item_name,category_id,quantity,expiry_date,added_by],
    (err)=>{
        if(err){
            console.log(err);
            res.status(500).send("DB Error");
        } else {
            res.send("Item added");
        }
    });

});


// -------------------- DELETE ITEM --------------------
app.delete("/deleteItem/:id",(req,res)=>{

    db.query("DELETE FROM items WHERE item_id=?",
    [req.params.id],
    (err)=>{
        if(err){
            console.log(err);
            res.status(500).send("Delete failed");
        } else {
            res.send("Item deleted");
        }
    });

});


// -------------------- START SERVER --------------------
app.listen(3000,()=>console.log("Server running on port 3000"));
