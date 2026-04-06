const express = require('express');
const { handleQuery } = require('../controllers/queryController');

const router = express.Router();

// POST /api/query
router.post('/', handleQuery);

module.exports = router;
