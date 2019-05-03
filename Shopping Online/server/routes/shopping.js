var express = require('express');
var router = express.Router();
var path = require('path');
/* GET users listing. */

router.post('/api', function(req, res, next) {
  filepath = path.join(__dirname,'../docs')+'/api_doc_JB-Brunch.pdf';
  res.sendFile(filepath);
});

module.exports = router;
