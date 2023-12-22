const express = require("express")
const router = express.Router()
const db = require("../db")
const slugify = require("slugify")

// view all industries
router.get('/', async (req, res) => {
    try {
        const allIndustries = await db.query(`SELECT * FROM industries`)
        return res.json(allIndustries.rows)   
    } catch (error) {
        return res.status(404).send("Sorry there are no industries currently available to view")
    }
})

// add an industry
router.post('/', async (req, res) => {
    try {
        const { code, industry } = req.body
        const addedIndustry = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *`, [code, industry])
        return res.json(addedIndustry.rows[0])
    } catch (error) {
        return res.status(404).send("Sorry could not add industry")
    }
})

module.exports = router