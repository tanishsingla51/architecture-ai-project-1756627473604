import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);

export default router;
