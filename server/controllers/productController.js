import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
    try {
        const deleted = req.query.deleted === "true";
        const products = deleted
            ? await Product.getDeleted()
            : await Product.getAll();

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const id = await Product.create(req.body);
        res.json({ message: "Product added successfully", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        res.json({ message: "Product updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.softDelete(req.params.id);
        res.json({ message: "Product moved to trash" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const restoreProduct = async (req, res) => {
    try {
        await Product.restore(req.params.id);
        res.json({ message: "Product restored successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};