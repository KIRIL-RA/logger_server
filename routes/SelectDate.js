var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/../static_hidden/SelectDate/index.html'));
});

module.exports = router;