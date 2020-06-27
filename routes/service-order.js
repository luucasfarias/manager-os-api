const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

const NAME_TABLE = 'serviceorder';

router.get("/", (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if (error) {
			return res.status(500).send({ error: error });
		}
		conn.query(`SELECT * FROM ${NAME_TABLE};`, (error, result, field) => {
			if (error) {
				return res.status(500).send({ error: error, response: null });
			}

			return res.status(200).send({
				response: result
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
			`INSERT INTO ${NAME_TABLE}(requesting_name, cod_reference, phone, email, locality, responsible_equipment, cod_patrimony, serial_number, problem_description) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				req.body.requesting_name,
				req.body.cod_reference,
				req.body.phone,
				req.body.email,
				req.body.locality,
				req.body.responsible_equipment,
				req.body.cod_patrimony,
				req.body.serial_number,
				req.body.problem_description
			],
			(error, result, field) => {
				conn.release();
				if (error) {
					return res.status(500).send({ error: error, response: null });
				}
				res.status(201).send({
					idProduct: result.insertId,
					message: "success service order created",
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
        SET requesting_name = ?, cod_reference = ?, phone  = ?, locality = ?, email = ?, responsible_equipment = ?, cod_patrimony = ?, serial_number = ?, problem_description = ?
      WHERE id = ?`,
			[
				req.body.requesting_name,
				req.body.cod_reference,
				req.body.phone,
				req.body.email,
				req.body.locality,
				req.body.responsible_equipment,
				req.body.cod_patrimony,
				req.body.serial_number,
				req.body.problem_description,
			],
			(error, result, field) => {
				if (error) {
					return res.status(500).send({ error: error, response: null });
				}
				res.status(202).send({
					message: "update service order success",
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
					message: "delete service order success",
				});
			}
		);
	});
});

module.exports = router;
