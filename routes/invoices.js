const express = require("express")
const router = express.Router()
const db = require("../db")

router.get('/', async (req, res) => {
    try {
        const invoices = await db.query(`SELECT * FROM invoices`)
        return res.json({"invoices": invoices.rows})
    } catch (error) {
        return res.status(404).send("Sorry couldn't get invoices")
    }
})

router.get('/:id', async (req,res) => {
    try {
        const invoice = await db.query(`SELECT * FROM invoices WHERE id=$1`,[req.params.id])
        return res.json(invoice.rows[0])
    } catch (error) {
        return res.status(404).send("Sorry couldn't get invoice")
    }
})

router.post('/', async (req,res) => {
    try {
        const { id, comp_code, amt, paid, add_date, paid_date } = req.body
        const addedCompany = await db.query(`INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,[id, comp_code, amt, paid, add_date, paid_date])
        return res.json({"invoice": addedCompany.rows[0]})
    } catch (error) {
        return res.status(404).send("Sorry couldn't add invoice")
    }
})

router.put('/:id', async (req,res) => {
    const idParam = req.params.id
    try {
        const invoice = await db.query(`SELECT * FROM invoices WHERE id=$1`, [idParam])
        if(!invoice.rows[0].id){
            return
        }
        const { id, comp_code, amt, paid, add_date, paid_date } = req.body
        const addedInvoice = await db.query(`UPDATE invoices SET id=$1, comp_code=$2, amt=$3, paid=$4, add_date=$5, paid_date=$6 WHERE id=$7 RETURNING *`, [id, comp_code, amt, paid, add_date, paid_date, idParam])
        return res.json({"invoice": addedInvoice.rows[0]})
    } catch (error) {
        return res.status(404).send("Sorry couldn't update invoice")
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const invoice = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING *`, [req.params.id])
        if(!invoice.rows[0].id){
            return
        }
        return res.json({"status": "deleted"})
    } catch (error) {
        return res.status(404).send("Sorry couldn't delete invoice")
    }
})

router.get('/')

module.exports = router