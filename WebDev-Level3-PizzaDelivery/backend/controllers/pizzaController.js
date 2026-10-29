const Pizza = require('../models/Pizza');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

// Get all pizzas with complete multi-pizza auto-seed & synchronization
exports.getPizzas = async (req, res) => {
    try {
        const defaultPizzas = [
            { name: 'Margherita Pizza', price: 199, description: 'Fresh tomato, mozzarella, basil', stock: 50 },
            { name: 'Pepperoni Pizza', price: 249, description: 'Pepperoni, mozzarella, special sauce', stock: 40 },
            { name: 'Veggie Supreme', price: 229, description: 'Onion, capsicum, tomato, olives, corn', stock: 45 },
            { name: 'Chicken Tikka Pizza', price: 279, description: 'Chicken tikka, onion, capsicum', stock: 35 },
            { name: 'Cheese Burst Pizza', price: 299, description: 'Extra cheese, mozzarella, herbs', stock: 30 },
            { name: 'Meat Lovers Pizza', price: 349, description: 'Chicken, pepperoni, sausage, bacon', stock: 25 },
            { name: 'Spicy Paneer Pizza', price: 259, description: 'Paneer, capsicum, onion, spicy sauce', stock: 40 },
            { name: 'BBQ Chicken Pizza', price: 289, description: 'BBQ chicken, onion, capsicum', stock: 35 }
        ];

        for (let p of defaultPizzas) {
            await Pizza.updateOne(
                { name: p.name },
                { $setOnInsert: p },
                { upsert: true }
            );
        }

        const pizzas = await Pizza.find();
        res.status(200).json(pizzas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new pizza item (for admin/setup)
exports.createPizza = async (req, res) => {
    try {
        const newPizza = new Pizza(req.body);
        await newPizza.save();
        res.status(201).json(newPizza);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Pizza Price & Stock by Admin (Live Database Synchronization)
exports.updatePizzaPrice = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const updateData = { price };
        if (stock !== undefined) {
            updateData.stock = stock;
        }

        const updatedPizza = await Pizza.findOneAndUpdate(
            { name: name },
            updateData,
            { new: true, upsert: true }
        );
        res.status(200).json({ message: 'Pizza details updated successfully!', updatedPizza });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Place a new customized pizza order & decrement stock safely (Prevents negative stock)
exports.createOrder = async (req, res) => {
    try {
        const { pizzaDetails } = req.body;

        // 1. Check if catalog pizza stock is available before placing order
        if (pizzaDetails && pizzaDetails.name) {
            const catalogPizza = await Pizza.findOne({ name: pizzaDetails.name });
            if (catalogPizza && catalogPizza.stock <= 0) {
                return res.status(400).json({ error: `Sorry, ${pizzaDetails.name} is currently Out of Stock!` });
            }
        }

        const orderData = {
            ...req.body,
            userId: req.user ? (req.user.id || req.user.userId) : undefined 
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // 2. Automatically decrement stock for catalog pizza safely (ensures stock > 0)
        if (pizzaDetails && pizzaDetails.name) {
            await Pizza.findOneAndUpdate(
                { name: pizzaDetails.name, stock: { $gt: 0 } },
                { $inc: { stock: -1 } }
            );
        }

        // 3. Automatically decrement stock for selected ingredients safely
        if (pizzaDetails) {
            const itemsToDecrement = [
                pizzaDetails.base,
                pizzaDetails.sauce,
                pizzaDetails.cheese,
                ...(pizzaDetails.veggies || [])
            ];

            for (let itemName of itemsToDecrement) {
                if (itemName) {
                    await Inventory.findOneAndUpdate(
                        { itemName: itemName, stock: { $gt: 0 } },
                        { $inc: { stock: -1 } }
                    );
                }
            }
        }

        res.status(201).json({ message: 'Order placed successfully and stock updated!', newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get orders placed by users
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order status by ID
exports.getOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Order Status by Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json({ message: 'Order status updated successfully!', updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all registered users for admin dashboard
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all inventory stock items with auto-seed fallback
exports.getInventory = async (req, res) => {
    try {
        let inventory = await Inventory.find({});
        if (!inventory || inventory.length === 0) {
            const defaultInventory = [
                { itemName: 'New Hand Tossed', category: 'base', stock: 50 },
                { itemName: 'Wheat Thin Crust', category: 'base', stock: 40 },
                { itemName: 'Cheese Burst Crust', category: 'base', stock: 30 },
                { itemName: 'Classic Pan Base', category: 'base', stock: 45 },
                { itemName: 'Gluten Free Base', category: 'base', stock: 25 },
                { itemName: 'Classic Tomato Sauce', category: 'sauce', stock: 60 },
                { itemName: 'Spicy Barbeque Sauce', category: 'sauce', stock: 50 },
                { itemName: 'Creamy Garlic White Sauce', category: 'sauce', stock: 40 },
                { itemName: 'Mozzarella Cheese', category: 'cheese', stock: 100 },
                { itemName: 'Cheddar Cheese Blend', category: 'cheese', stock: 80 },
                { itemName: 'Black Olives', category: 'vegetables', stock: 70 },
                { itemName: 'Crisp Capsicum', category: 'vegetables', stock: 60 },
                { itemName: 'Fresh Mushrooms', category: 'vegetables', stock: 50 },
                { itemName: 'Red Onions', category: 'vegetables', stock: 90 },
                { itemName: 'Sweet Corn', category: 'vegetables', stock: 65 },
                { itemName: 'Jalapenos', category: 'vegetables', stock: 55 }
            ];
            await Inventory.insertMany(defaultInventory);
            inventory = await Inventory.find({});
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Manual Stock Update by Admin
exports.updateInventoryStock = async (req, res) => {
    try {
        const { itemId, stock } = req.body;
        const updatedItem = await Inventory.findByIdAndUpdate(
            itemId,
            { stock: Number(stock) },
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ error: 'Inventory item not found' });
        res.status(200).json({ message: 'Stock updated successfully!', updatedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Real Admin Analytics & Stats for Dashboard
exports.getAdminStats = async (req, res) => {
    try {
        const orders = await Order.find({});
        const users = await User.find({});

        let totalRevenue = 0;
        let totalPizzasSold = 0;
        const dailySales = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const pizzaCounts = {};

        orders.forEach(ord => {
            const price = ord.pizzaDetails?.price || 0;
            totalRevenue += price;
            totalPizzasSold += 1;

            const pName = ord.pizzaDetails?.name || 'Custom Pizza';
            pizzaCounts[pName] = (pizzaCounts[pName] || 0) + 1;

            if (ord.createdAt) {
                const day = new Date(ord.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
                if (dailySales[day] !== undefined) {
                    dailySales[day] += 1;
                }
            }
        });

        const topPizzas = Object.keys(pizzaCounts)
            .map(name => ({ name, count: pizzaCounts[name] }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            totalOrders: orders.length,
            totalRevenue,
            totalPizzasSold,
            totalCustomers: users.length,
            dailySales,
            topPizzas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};