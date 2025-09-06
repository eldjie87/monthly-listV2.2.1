import saldo from '../controller/saldo.js';
import express from 'express';

const router = express.Router();

router.post('/saldo', saldo.updateSaldo);
router.put('/saldo', saldo.addSaldo);
router.get('/saldo', saldo.getSaldo);

export default router;