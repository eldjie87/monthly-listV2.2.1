import product from "../controller/product.js";
import express from 'express';

const router = express.Router();

router.post('/products', product.addProduct);
// router.put('/products/:id', product.updateProduct);
router.get('/products', product.getProducts);
router.post('/products/save', product.saveProducts);
router.get('/products/saved', product.getSavedFiles);

// router.get('/products/:id', product.getProductById);
router.delete('/products/:id', product.deleteProduct);
router.delete('/products/saved/:id', product.deleteSavedFile); //optional
router.get('/products/saved/:id', product.getSavedFileById); //optional
router.delete('/products', product.deleteAllProducts); //optional

export default router;