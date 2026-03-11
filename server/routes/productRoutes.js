import express from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/restore/:id', restoreProduct);

export default router;