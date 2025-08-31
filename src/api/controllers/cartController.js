import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!user || !product) {
    res.status(404);
    throw new Error('User or Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough product in stock');
  }

  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Product already in cart, update quantity
    user.cart[itemIndex].quantity += quantity;
  } else {
    // Product not in cart, add new item
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  const populatedUser = await user.populate('cart.product');
  res.status(200).json(populatedUser.cart);
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity = quantity;
    await user.save();
    const populatedUser = await user.populate('cart.product');
    res.status(200).json(populatedUser.cart);
  } else {
    res.status(404);
    throw new Error('Item not in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.cart = user.cart.filter((item) => item.product.toString() !== productId);

  await user.save();
  const populatedUser = await user.populate('cart.product');
  res.status(200).json(populatedUser.cart);
});

export { getCart, addItemToCart, updateCartItem, removeItemFromCart };
