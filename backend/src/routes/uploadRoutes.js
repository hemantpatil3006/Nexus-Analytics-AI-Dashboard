const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const { processCSV } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload
router.post('/', upload.single('file'), processCSV);

module.exports = router;
