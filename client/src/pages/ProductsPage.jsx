import { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/Table';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [view, setView] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', description: '' });

    useEffect(() => {
        fetchProducts();
    }, [view]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.getProducts(view === 'deleted');
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ name: product.name, price: product.price, description: product.description });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.updateProduct(editingProduct.id, formData);
                setSuccess('Product updated successfully!');
            } else {
                await api.createProduct(formData);
                setSuccess('Product added successfully!');
            }
            setIsModalOpen(false);
            fetchProducts();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Move this product to trash?')) {
            try {
                await api.deleteProduct(id);
                setSuccess('Product moved to trash');
                fetchProducts();
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                setError('Failed to delete product');
            }
        }
    };

    const handleRestore = async (id) => {
        try {
            await api.restoreProduct(id);
            setSuccess('Product restored successfully');
            fetchProducts();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to restore product');
            setTimeout(() => setError(null), 3000);
        }
    };

    const columns = [
        { accessor: 'name', header: 'Name', sortable: true },
        { accessor: 'price', header: 'Price', sortable: true, render: (val) => `$${Number(val).toFixed(2)}` },
        { accessor: 'description', header: 'Description', sortable: false },
        {
            accessor: 'created_at',
            header: view === 'active' ? 'Created At' : 'Deleted At',
            sortable: true,
            render: (val, item) => new Date(view === 'active' ? item.created_at : item.deleted_at).toLocaleDateString()
        }
    ];

    const processedProducts = products.map(p => ({
        ...p,
        actions: (
            view === 'active' ? (
                <>
                    <button className="btn btn-secondary" onClick={() => openModal(p)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </>
            ) : (
                <button className="btn btn-success" onClick={() => handleRestore(p.id)}>Restore</button>
            )
        )
    }));

    return (
        <div className="app-container">
            <header className="dashboard-header">
                <h1>Products Dashboard</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>+ Add Product</button>
            </header>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <section className="controls-section">
                <div className="tabs">
                    <button
                        className={`tab ${view === 'active' ? 'active' : ''}`}
                        onClick={() => setView('active')}
                    >
                        Active Products
                    </button>
                    <button
                        className={`tab ${view === 'deleted' ? 'active' : ''}`}
                        onClick={() => setView('deleted')}
                    >
                        Deleted Products
                    </button>
                </div>
            </section>

            {loading ? (
                <div className="loading-container">Loading products...</div>
            ) : (
                <Table
                    columns={columns}
                    data={processedProducts}
                />
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
