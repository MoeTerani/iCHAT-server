export {};
import * as express from 'express';

const router = express.Router();
router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Server is up and running');
});

module.exports = router;
