
import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, Check, X, MapPin, Phone, Mail } from 'lucide-react';


export default function AddressBook() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const initialFormData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pin: '',
        label: 'Home',
    };

    const [formData, setFormData] = useState(initialFormData);

    // Get auth token from localStorage (adjust based on your auth setup)
    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken') || '';
        }
        return '';
    };

    // API base URL
    const API_BASE_URL = 'http://localhost:3001';

    // Fetch addresses
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getAuthToken();

            const response = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setAddresses(data.data || []);
            } else {
                setError(data.message || 'Failed to load addresses');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('[v0] Fetch addresses error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submit (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const token = getAuthToken();
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId
                ? `${API_BASE_URL}/api/addresses/${editingId}`
                : `${API_BASE_URL}/api/addresses`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                await fetchAddresses();
                setShowModal(false);
                setEditingId(null);
                setFormData(initialFormData);
            } else {
                setError(data.message || 'Failed to save address');
            }
        } catch (err) {
            setError('Error saving address');
            console.error('[v0] Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle edit
    const handleEdit = (address) => {
        setEditingId(address._id);
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2 || '',
            city: address.city,
            state: address.state,
            pin: address.pin,
            label: address.label,
        });
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                await fetchAddresses();
                setDeleteConfirm(null);
            } else {
                setError(data.message || 'Failed to delete address');
            }
        } catch (err) {
            setError('Error deleting address');
            console.error('[v0] Delete error:', err);
        }
    };

    // Handle set default
    const handleSetDefault = async (id) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/api/addresses/${id}/set-default`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                await fetchAddresses();
            } else {
                setError(data.message || 'Failed to set default address');
            }
        } catch (err) {
            setError('Error setting default address');
            console.error('[v0] Set default error:', err);
        }
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData(initialFormData);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Address Book</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your delivery addresses</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Address
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    </div>
                ) : addresses.length === 0 ? (
                    // Empty State
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 text-center">
                        <MapPin className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No addresses yet</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Add your first address to get started with fast checkout
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add First Address
                        </button>
                    </div>
                ) : (
                    // Address Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 relative"
                            >
                                {/* Default Badge */}
                                {address.isDefault && (
                                    <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                                        Default
                                    </div>
                                )}

                                {/* Label */}
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                                    {address.label}
                                </h3>

                                {/* Address Details */}
                                <div className="space-y-3 mb-5">
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {address.firstName} {address.lastName}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                                        <div className="text-sm">
                                            <p>{address.address1}</p>
                                            {address.address2 && <p>{address.address2}</p>}
                                            <p>
                                                {address.city}, {address.state} {address.pin}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-sm">{address.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-sm">{address.email}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address._id)}
                                            className="flex-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(address._id)}
                                        className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 py-2 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {editingId ? 'Edit Address' : 'Add New Address'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                {/* Contact Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Address Line 1 *
                                    </label>
                                    <input
                                        type="text"
                                        name="address1"
                                        value={formData.address1}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="address2"
                                        value={formData.address2}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="Apartment, suite, etc. (optional)"
                                    />
                                </div>

                                {/* City, State, ZIP */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="NY"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            ZIP/Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="pin"
                                            value={formData.pin}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>

                                {/* Label */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Address Type
                                    </label>
                                    <select
                                        name="label"
                                        value={formData.label}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Modal Footer */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="inline-block animate-spin">⏳</span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Save Address
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Address?</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                This action cannot be undone. The address will be permanently deleted.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
