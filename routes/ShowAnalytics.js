var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/:year/:month/:date', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/../static/ShowAnalytics/index.html'));
});

module.exports = router;