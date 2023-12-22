const express = require("express")
const router = express.Router()
const db = require("../db")
const slugify = require("slugify")

// get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await db.query(`SELECT * FROM invoices`)
        return res.json({"invoices": invoices.rows})
    } catch (error) {
        return res.status(404).send("Sorry couldn't get invoices")
    }
})

// get one invoice
router.get('/:id', async (req,res) => {
    try {
        const invoice = await db.query(`SELECT * FROM invoices WHERE id=$1`,[req.params.id])
        return res.json(invoice.rows[0])
    } catch (error) {
        return res.status(404).send("Sorry couldn't get invoice")
    }
})

// add an invoice
router.post('/', async (req,res) => {
    try {
        const { id, comp_code, amt, paid, add_date, paid_date } = req.body
        const addedCompany = await db.query(`INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,[id, comp_code, amt, paid, add_date, paid_date])
        return res.json({"invoice": addedCompany.rows[0]})
    } catch (error) {
        return res.status(404).send("Sorry couldn't add invoice")
    }
})

// update an invoice
router.put('/:id', async (req,res) => {
    const id = req.params.id
    try {
        const invoice = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])
        if(!invoice.rows[0].id){
            return
        }
        const { amt, paid } = req.body
        const isPaid = invoice.rows[0].paid

        if(!isPaid && paid){
            await db.query(`UPDATE invoices SET paid=$1, paid_date=CURRENT_DATE WHERE id=$2`, [paid, id])
        } else if(isPaid && !paid) {
            await db.query(`UPDATE invoices SET paid=$1, paid_date=null WHERE id=$2`, [paid, id])
        } 
        const addedInvoice = await db.query(`UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *`, [amt, id])
        return res.json({"invoice": addedInvoice.rows[0]})
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
})

// delete an invoice
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


module.exports = router