var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('diary/diary', { title: 'Diary Obat' });
});

module.exports = router;
