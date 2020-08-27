export {};
import { error } from 'console';

const express = require('express');
const router = express.Router();
router.get('/', (req: any, res: any) => {
  res.send('Server is up and running');
});

module.exports = router;
