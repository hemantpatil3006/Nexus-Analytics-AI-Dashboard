const fs = require('fs');
const csv = require('csv-parser');

const processCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  // Read and parse the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Return first 50 rows for Sprint 1 data display
      const previewData = results.slice(0, 50);
      
      // Clean up the uploaded file after processing (optional but good practice)
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      res.status(200).json({
        message: 'File processed successfully',
        totalRows: results.length,
        data: previewData,
        columns: results.length > 0 ? Object.keys(results[0]) : []
      });
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error processing the file' });
    });
};

module.exports = { processCSV };
