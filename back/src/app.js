import express from 'express';
import saldo from '../router/saldo.js';
import product from '../router/product.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3030;
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../../front')));

app.use('/api', product);
app.use('/api', saldo);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// export default supabase;