const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

const NAME_TABLE = 'product';

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(`SELECT * FROM ${NAME_TABLE};`, (error, result, fields) => {
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
      `SELECT * FROM ${NAME_TABLE} WHERE id = ?;`,
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
      `INSERT INTO ${NAME_TABLE}(name, brand, pattern, amount, manufacturer, description, esn) 
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
      `UPDATE ${NAME_TABLE}
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
        req.body.id,
      ],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        res.status(202).send({
          message: "update product success",
        });
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `DELETE FROM ${NAME_TABLE} WHERE id = ?`,
      [req.body.id],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        res.status(202).send({
          message: "delete product success",
        });
      }
    );
  });
});

module.exports = router;
