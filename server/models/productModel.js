import db from '../config/db.js';

const Product = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM products WHERE deleted_at IS NULL ORDER BY created_at DESC');
        return rows;
    },

    getDeleted: async () => {
        const [rows] = await db.query('SELECT * FROM products WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC');
        return rows;
    },

    create: async (productData) => {
        const { name, price, description } = productData;
        const [result] = await db.query(
            'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
            [name, price, description]
        );
        return result.insertId;
    },

    update: async (id, productData) => {
        const { name, price, description } = productData;
        await db.query(
            'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?',
            [name, price, description, id]
        );
    },

    softDelete: async (id) => {
        await db.query('UPDATE products SET deleted_at = NOW() WHERE id = ?', [id]);
    },

    restore: async (id) => {
        await db.query('UPDATE products SET deleted_at = NULL WHERE id = ?', [id]);
    }
};

export default Product;
