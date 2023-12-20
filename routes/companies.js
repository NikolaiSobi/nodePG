const express = require("express")
const router = express.Router()
const db = require("../db")


router.get('/', async (req, res, next) => {
    try {
        const allCompanies = await db.query(`SELECT * FROM companies`);
        return res.json({"Companies": allCompanies.rows})
    } catch (error) {
        console.error(error)
        return res.json("ERROR")
    }
})

router.get('/:code', async (req, res) => {
    try {
        const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [req.params.code])
        const invoice = await db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [req.params.code])

        if(company.rows.length < 1){
            return res.status(404).send(`Sorry could not find ${req.params.code} company`)
        }
        return res.json({"company": {...company.rows[0], "invoices": invoice.rows}})
    } catch (error) {
        console.error(error)
        return res.status(404)
    }
})

router.post('/', async (req, res) => {
    try {
        const { code, name, description } = req.body 
        const addedCompany = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`, [code, name, description])
        return res.status(201).json(addedCompany.rows[0])
    } catch (error) {
        return res.status(404).send(`Sorry could not add company`)
    }
})

router.put('/:code', async (req, res) => {
    const codeParam = req.params.code
    try {
        const company = await db.query(`SELECT * FROM companies Where code='${codeParam}'`)
        if(!company.rows[0].code){
            return
        }

        const { code, name, description } = req.body 
        const updateCompany = await db.query(`UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$4 RETURNING *`, [code, name, description, codeParam])
        return res.json(updateCompany.rows[0])
    } catch (error) {
        return res.status(404).send(`Sorry could not update ${codeParam}`)
    }
})

router.delete('/:code', async (req, res) => {
    const codeParam = req.params.code
    try {
        const company = await db.query(`SELECT * FROM companies Where code='${codeParam}'`)
        if(!company.rows[0].code){
            return
        }
 
        const deleteCompany = await db.query(`DELETE FROM companies WHERE code='${codeParam}'`)
        return res.json({"status": "deleted"})
    } catch (error) {
        return res.status(404).send(`Sorry could not delete ${codeParam}`)
    }
})

module.exports = router