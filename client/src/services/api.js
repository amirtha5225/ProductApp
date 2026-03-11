import axios from 'axios';

const baseURL = 'http://localhost:5000/api/products';

const api = {
    getProducts: async (deleted = false) => {
        const { data } = await axios.get(`${baseURL}?deleted=${deleted}`);
        return data;
    },

    createProduct: async (productData) => {
        const { data } = await axios.post(baseURL, productData);
        return data;
    },

    updateProduct: async (id, productData) => {
        const { data } = await axios.put(`${baseURL}/${id}`, productData);
        return data;
    },

    deleteProduct: async (id) => {
        const { data } = await axios.delete(`${baseURL}/${id}`);
        return data;
    },

    restoreProduct: async (id) => {
        const { data } = await axios.put(`${baseURL}/restore/${id}`);
        return data;
    }
};

export default api;
