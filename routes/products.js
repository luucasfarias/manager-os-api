const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM product;", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error, response: null });
      }
      return res.status(200).send({
        response: result,
      });
    });
  });
});

router.get("/:id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM product WHERE id = ?;",
      [req.params.id],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        return res.status(200).send({
          response: result,
        });
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `INSERT INTO product(name, brand, pattern, amount, manufacturer, description, esn) 
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.name,
        req.body.brand,
        req.body.pattern,
        req.body.amount,
        req.body.manufacturer,
        req.body.description,
        req.body.esn,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        res.status(201).send({
          idProduct: result.insertId,
          message: "success product created",
        });
      }
    );
  });
});

router.put("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `UPDATE product
        SET name = ?, brand = ?, pattern  = ?, amount = ?, manufacturer = ?, description = ?, esn = ?
      WHERE id = ?`,
      [
        req.body.name,
        req.body.brand,
        req.body.pattern,
        req.body.amount,
        req.body.manufacturer,
        req.body.description,
        req.body.esn,
        req.body.id
      ],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        res.status(201).send({
          message: "update product success",
        });
      }
    );
  });
});

module.exports = router;
