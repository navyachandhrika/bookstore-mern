// src/pages/AdminDashboard.jsx — Admin panel: manage books & orders
import { useEffect, useState } from 'react';
import { FiBook, FiShoppingBag, FiDollarSign, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { getBooks, createBook, updateBook, deleteBook } from '../services/bookService.js';
import { getAllOrders, updateOrderStatus } from '../services/orderService.js';
import Alert from '../components/Alert.jsx';

const TABS = ['Books', 'Orders'];
const ORDER_STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_STYLES = {
  Pending: 'badge-warning', Paid: 'badge-primary', Shipped: 'badge-accent',
  Delivered: 'badge-success', Cancelled: 'badge-danger',
};

const EMPTY_BOOK = {
  title: '', author: '', genre: '', language: 'English',
  description: '', price: '', stock: '', coverImageUrl: '', featured: false,
};

export default function AdminDashboard() {
  const [tab, setTab]         = useState('Books');
  const [books, setBooks]     = useState([]);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert]     = useState(null);

  // Book modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook]   = useState(null);
  const [bookForm, setBookForm]   = useState(EMPTY_BOOK);
  const [saving, setSaving]       = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, ordersRes] = await Promise.all([
        getBooks({ limit: 100 }),
        getAllOrders(),
      ]);
      setBooks(booksRes.data.books || []);
      setOrders(ordersRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─── Stats ────────────────────────────────────────────────────────────────────
  const totalSales    = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const activeOrders  = orders.filter((o) => !['Delivered','Cancelled'].includes(o.status)).length;

  // ─── Book Modal ───────────────────────────────────────────────────────────────
  const openCreateModal = () => { setEditBook(null); setBookForm(EMPTY_BOOK); setModalOpen(true); };
  const openEditModal   = (book) => {
    setEditBook(book);
    setBookForm({
      title: book.title, author: book.author, genre: book.genre,
      language: book.language, description: book.description,
      price: book.price, stock: book.stock, coverImageUrl: book.coverImageUrl || '',
      featured: book.featured || false,
    });
    setModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...bookForm, price: Number(bookForm.price), stock: Number(bookForm.stock) };
      if (editBook) {
        await updateBook(editBook._id, payload);
        setAlert({ type: 'success', message: 'Book updated successfully.' });
      } else {
        await createBook(payload);
        setAlert({ type: 'success', message: 'Book created successfully.' });
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm('Delete this book permanently?')) return;
    try {
      await deleteBook(id);
      setAlert({ type: 'success', message: 'Book deleted.' });
      await fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Delete failed.' });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
      setAlert({ type: 'success', message: 'Order status updated.' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    }
  };

  const updateForm = (key, val) => setBookForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="page-wrapper page-enter">
      <div className="container-custom py-10">
        <h1 className="section-title mb-8">Admin Dashboard</h1>

        {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} dismissible onDismiss={() => setAlert(null)} /></div>}

        {/* ─── Stats Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: FiDollarSign, label: 'Total Sales', value: `$${totalSales.toFixed(2)}`, color: '#22c55e' },
            { icon: FiBook,       label: 'Total Books', value: books.length,                 color: '#6366f1' },
            { icon: FiShoppingBag, label: 'Active Orders', value: activeOrders,              color: '#f97316' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-panel rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon className="text-xl" style={{ color }} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : tab === 'Books' ? (
          /* ─── Books Tab ───────────────────────────────────────────────── */
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400 text-sm">{books.length} books</p>
              <button onClick={openCreateModal} className="btn-primary py-2 px-5 text-sm"><FiPlus /> Add Book</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th className="text-slate-500 font-medium py-3 px-3">Book</th>
                    <th className="text-slate-500 font-medium py-3 px-3 hidden sm:table-cell">Genre</th>
                    <th className="text-slate-500 font-medium py-3 px-3">Price</th>
                    <th className="text-slate-500 font-medium py-3 px-3 hidden md:table-cell">Stock</th>
                    <th className="text-slate-500 font-medium py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={book.coverImageUrl} alt="" className="w-9 h-12 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.src='https://via.placeholder.com/36x48/312e81/818cf8?text=📚'; }} />
                          <div>
                            <p className="text-white font-medium truncate max-w-[200px]">{book.title}</p>
                            <p className="text-slate-500 text-xs">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell"><span className="badge-primary">{book.genre}</span></td>
                      <td className="py-3 px-3 text-white font-semibold">${book.price?.toFixed(2)}</td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <span className={book.stock > 0 ? 'text-green-400' : 'text-red-400'}>{book.stock}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(book)} className="p-2 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-all"><FiEdit /></button>
                          <button onClick={() => handleDeleteBook(book._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* ─── Orders Tab ──────────────────────────────────────────────── */
          <>
            <p className="text-slate-400 text-sm mb-6">{orders.length} orders</p>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="glass-panel rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="text-white font-semibold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                      <span className={STATUS_STYLES[order.status]}>{order.status}</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      {order.user?.name || 'User'} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-white font-bold">${order.totalPrice?.toFixed(2)}</p>
                  <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="select-field w-40 text-xs py-2">
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── Book Modal ──────────────────────────────────────────────── */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="relative glass-panel rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-xl">{editBook ? 'Edit Book' : 'Add New Book'}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><FiX /></button>
              </div>

              <form onSubmit={handleSaveBook} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1">Title</label>
                    <input required value={bookForm.title} onChange={(e) => updateForm('title', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Author</label>
                    <input required value={bookForm.author} onChange={(e) => updateForm('author', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Genre</label>
                    <input required value={bookForm.genre} onChange={(e) => updateForm('genre', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Language</label>
                    <input required value={bookForm.language} onChange={(e) => updateForm('language', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Price ($)</label>
                    <input type="number" step="0.01" min="0" required value={bookForm.price} onChange={(e) => updateForm('price', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Stock</label>
                    <input type="number" min="0" required value={bookForm.stock} onChange={(e) => updateForm('stock', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Cover Image URL</label>
                    <input value={bookForm.coverImageUrl} onChange={(e) => updateForm('coverImageUrl', e.target.value)} className="input-field" placeholder="/covers/filename.png" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1">Description</label>
                    <textarea rows={3} required value={bookForm.description} onChange={(e) => updateForm('description', e.target.value)} className="input-field resize-none" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={bookForm.featured} onChange={(e) => updateForm('featured', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="featured" className="text-slate-400 text-sm">Mark as Featured</label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 py-3">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
                    {saving ? 'Saving...' : editBook ? 'Update Book' : 'Create Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
