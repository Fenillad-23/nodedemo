const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 5000;

// MongoDB connection
mongoose.connect(
    "mongodb+srv://dbfenil:STjTtRC7Fi1KS6ls@cluster0.fiab4b3.mongodb.net/demo?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});



const app = express();
const Schema = mongoose.Schema;

app.use(cors());
app.use(bodyParser.json());

// ---------- Product API START -----------
const productSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    image: String,
    pricing: {
        type: Number,
        required: true,
    },
    shippingCost: Number
});

const Product = mongoose.model("product", productSchema);

// created get api
app.get("/product", async (req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created post api
app.post("/add/product", async (req, res) => {
    const product = new Product({
        description: req.body.description,
        image: req.body.image,
        pricing: req.body.pricing,
        shippingCost: req.body.shippingCost,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// created delete api
app.delete("/product/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created update api
app.put("/product/:id", async (req, res) => {
    const id = req.params.id;
    const updateProduct = {
        description: req.body.description,
        image: req.body.image,
        pricing: req.body.pricing,
        shippingCost: req.body.shippingCost
    };

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updateProduct, {
            new: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "product not found" });
        }

        res.json({ message: "product updated successfully", updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// ---------- Product API END -----------

// ---------- User API START -----------
const userSchema = new Schema({
    email: String,
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    purchaseHistory: String,
    shippingAddress: String
});

const User = mongoose.model("user", userSchema);

// created get api
app.get("/user", async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created post api
app.post("/add/user", async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        purchaseHistory: req.body.purchaseHistory,
        shippingAddress: req.body.shippingAddress
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// created delete api
app.delete("/user/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "user deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created update api
app.put("/user/:id", async (req, res) => {
    const id = req.params.id;
    const updateUser = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        purchaseHistory: req.body.purchaseHistory,
        shippingAddress: req.body.shippingAddress
    };

    try {
        const updatedUser = await User.findByIdAndUpdate(id, updateUser, {
            new: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "user not found" });
        }

        res.json({ message: "user updated successfully", updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------- User API END -----------

// ---------- Comment API START -----------

const commentSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    images: [String],
    text: String
});

const Comment = mongoose.model("comment", commentSchema);

// created get api
app.get("/comment", async (req, res) => {
    try {
        const comment = await Comment.find();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created post api
app.post("/add/comment", async (req, res) => {
    const comment = new Comment({
        productId: req.body.productId,
        userId: req.body.userId,
        rating: req.body.rating,
        images: req.body.images,
        text: req.body.text
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// created delete api
app.delete("/comment/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.json({ message: "comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created update api
app.put("/comment/:id", async (req, res) => {
    const id = req.params.id;
    const updateComment = {
        productId: req.body.productId,
        userId: req.body.userId,
        rating: req.body.rating,
        images: req.body.images,
        text: req.body.text
    };

    try {
        const updatedComment = await Comment.findByIdAndUpdate(id, updateComment, {
            new: true,
        });

        if (!updatedComment) {
            return res.status(404).json({ message: "comment not found" });
        }

        res.json({ message: "comment updated successfully", updatedComment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------- Comment API END -----------

// ---------- Cart API START -----------

const cartSchema = new Schema({
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: 'Quantity must be a positive number'
            }
        }
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Cart = mongoose.model("cart", cartSchema);

// created get api
app.get("/cart", async (req, res) => {
    try {
        const cart = await Cart.find();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created post api
app.post("/add/cart", async (req, res) => {
    const cart = new Cart({
        products: req.body.products,
        userId: req.body.userId,
    });

    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// created delete api
app.delete("/cart/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedCart = await Cart.findByIdAndDelete(id);

        if (!deletedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.json({ message: "cart deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created update api
app.put("/cart/:id", async (req, res) => {
    const id = req.params.id;
    const updateCart = {
        products: req.body.products,
        userId: req.body.userId,
    };

    try {
        const updatedCart = await Cart.findByIdAndUpdate(id, updateCart, {
            new: true,
            runValidators: true // Ensure validators are run during update
        });

        if (!updatedCart) {
            return res.status(404).json({ message: "cart not found" });
        }

        res.json({ message: "cart updated successfully", updatedCart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------- Cart API END -----------

// ---------- Order API START -----------
const statusValue = [];
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Quantity must be a positive number'
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Total Price must be a positive number'
        }
    },
    shippingAddress: String,
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        default: 'PENDING',
        validate: {
            validator: function (value) {
                return ;
            },
            message: 'Total Price must be a positive number'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("order", orderSchema);

// created get api
app.get("/order", async (req, res) => {
    try {
        const order = await Order.find();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created post api
app.post("/add/order", async (req, res) => {
    const order = new Order({
        userId: req.body.userId,
        cartId: req.body.cartId,
        quantity: req.body.quantity,
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        status: req.body.status,
        createdAt: req.body.createdAt
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// created delete api
app.delete("/order/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "order deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// created update api
app.put("/order/:id", async (req, res) => {
    const id = req.params.id;
    const updateOrder = {
        userId: req.body.userId,
        cartId: req.body.cartId,
        quantity: req.body.quantity,
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        status: req.body.status,
        createdAt: req.body.createdAt
    };

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, updateOrder, {
            new: true,
            runValidators: true // Ensure validators are run during update
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: "order not found" });
        }

        res.json({ message: "order updated successfully", updatedOrder });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------- Order API END -----------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});