const express = require("express")
const router = express.Router()
const db = require("../db")
const slugify = require("slugify")

// add a relationship between company and industry
router.post('/', async (req, res) => {
    try {
        const { company_code, industry_code } = req.body
        const addedAssociation = await db.query(`INSERT INTO companies_industries (company_code, industry_code) VALUES ($1, $2) RETURNING *`, [company_code, industry_code])
        return res.json(addedAssociation.rows)

    } catch (error) {
        console.error("oops", error)
        return res.status(404).send("Sorry could not add relationship")
    }
})

module.exports = router