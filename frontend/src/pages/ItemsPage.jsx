import { useMemo, useState } from 'react'
import {
  Boxes,
  CalendarDays,
  Edit3,
  MapPin,
  PackageOpen,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react'

const emptyItem = {
  name: '',
  description: '',
  category: '',
  ownerName: '',
  location: '',
  conditionStatus: 'GOOD',
  imageUrl: '',
  status: 'AVAILABLE',
}

function ItemEditorModal({
  editingItem,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    editingItem
      ? {
          ...emptyItem,
          ...editingItem,
        }
      : emptyItem
  )

  const [saving, setSaving] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    const successful = await onSave(form)

    setSaving(false)

    if (successful) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay">
      <form
        className="modal-card large-modal"
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              {editingItem ? 'UPDATE ITEM' : 'NEW ITEM'}
            </p>

            <h2>
              {editingItem
                ? 'Edit item details'
                : 'Add a community item'}
            </h2>
          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>Item name *</span>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Canon DSLR Camera"
              required
            />
          </label>

          <label className="form-field">
            <span>Category *</span>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Electronics">
                Electronics
              </option>
              <option value="Books">Books</option>
              <option value="Tools">Tools</option>
              <option value="Sports">Sports</option>
              <option value="Home">Home</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="form-field">
            <span>Owner name *</span>

            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Item owner's name"
              required
            />
          </label>

          <label className="form-field">
            <span>Location *</span>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Example: Colombo"
              required
            />
          </label>

          <label className="form-field">
            <span>Condition</span>

            <select
              name="conditionStatus"
              value={form.conditionStatus}
              onChange={handleChange}
            >
              <option value="EXCELLENT">
                Excellent
              </option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
          </label>

          <label className="form-field">
            <span>Image URL</span>

            <input
              name="imageUrl"
              value={form.imageUrl || ''}
              onChange={handleChange}
              placeholder="Optional image link"
            />
          </label>

          <label className="form-field full-width">
            <span>Description</span>

            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              placeholder="Describe the item and anything the borrower should know..."
              rows="4"
            />
          </label>
        </div>

        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : editingItem
                ? 'Update Item'
                : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  )
}

function BorrowModal({ item, onSubmit, onClose }) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    borrowerName: '',
    borrowDate: today,
    returnDate: '',
    message: '',
  })

  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.returnDate < form.borrowDate) {
      setError(
        'Return date cannot be before the borrow date.'
      )
      return
    }

    setSending(true)

    const successful = await onSubmit(item.id, form)

    setSending(false)

    if (successful) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay">
      <form
        className="modal-card borrow-modal"
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">BORROW REQUEST</p>
            <h2>{item.name}</h2>
          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <div className="selected-item-summary">
          <div className="selected-item-icon">
            <PackageOpen size={24} />
          </div>

          <div>
            <strong>{item.name}</strong>
            <span>
              {item.category} · {item.location}
            </span>
          </div>
        </div>

        {error && (
          <div className="inline-error">{error}</div>
        )}

        <label className="form-field">
          <span>Your name *</span>

          <input
            name="borrowerName"
            value={form.borrowerName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </label>

        <div className="form-grid">
          <label className="form-field">
            <span>Borrow date *</span>

            <input
              type="date"
              name="borrowDate"
              value={form.borrowDate}
              min={today}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Return date *</span>

            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              min={form.borrowDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="form-field">
          <span>Message</span>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="3"
            placeholder="Tell the owner why you need this item..."
          />
        </label>

        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ItemCard({
  item,
  onEdit,
  onDelete,
  onBorrow,
}) {
  return (
    <article className="item-card">
      <div className="item-media">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <div className="item-placeholder">
            <PackageOpen size={46} />
          </div>
        )}

        <span
          className={`item-status ${item.status?.toLowerCase()}`}
        >
          {item.status}
        </span>
      </div>

      <div className="item-card-body">
        <div className="item-title-row">
          <div>
            <span className="category-tag">
              {item.category}
            </span>
            <h3>{item.name}</h3>
          </div>

          <span className="condition-tag">
            {item.conditionStatus || 'GOOD'}
          </span>
        </div>

        <p className="item-description">
          {item.description ||
            'No description has been provided for this item.'}
        </p>

        <div className="item-information">
          <span>
            <User size={15} />
            {item.ownerName}
          </span>

          <span>
            <MapPin size={15} />
            {item.location}
          </span>
        </div>

        <div className="item-actions">
          <button
            className="small-button neutral"
            type="button"
            onClick={() => onEdit(item)}
          >
            <Edit3 size={15} />
            Edit
          </button>

          <button
            className="small-button danger"
            type="button"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={15} />
            Delete
          </button>

          {item.status === 'AVAILABLE' && (
            <button
              className="small-button success"
              type="button"
              onClick={() => onBorrow(item)}
            >
              <CalendarDays size={15} />
              Borrow
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function ItemsPage({
  items,
  loading,
  onSaveItem,
  onDeleteItem,
  onBorrowItem,
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('ALL')
  const [editorItem, setEditorItem] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [borrowItem, setBorrowItem] = useState(null)

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.category
          ?.toLowerCase()
          .includes(searchValue) ||
        item.location
          ?.toLowerCase()
          .includes(searchValue) ||
        item.ownerName
          ?.toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [items, search, statusFilter])

  const openCreateModal = () => {
    setEditorItem(null)
    setEditorOpen(true)
  }

  const openEditModal = (item) => {
    setEditorItem(item)
    setEditorOpen(true)
  }

  const deleteItem = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    )

    if (confirmed) {
      onDeleteItem(id)
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ITEM COLLECTION</p>
          <h2>Community items</h2>
          <p className="page-description">
            Add, search and manage items available for
            borrowing.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      <section className="filter-bar">
        <div className="search-control">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by item, owner or location..."
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="ALL">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="BORROWED">Borrowed</option>
        </select>
      </section>

      <div className="result-summary">
        <Boxes size={17} />
        Showing {filteredItems.length} of {items.length}{' '}
        items
      </div>

      {loading ? (
        <div className="loading-state">
          Loading items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <PackageOpen size={38} />
          </div>

          <h3>No matching items found</h3>

          <p>
            Add a new item or change the search filters.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add First Item
          </button>
        </div>
      ) : (
        <section className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={openEditModal}
              onDelete={deleteItem}
              onBorrow={setBorrowItem}
            />
          ))}
        </section>
      )}

      {editorOpen && (
        <ItemEditorModal
          editingItem={editorItem}
          onSave={onSaveItem}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {borrowItem && (
        <BorrowModal
          item={borrowItem}
          onSubmit={onBorrowItem}
          onClose={() => setBorrowItem(null)}
        />
      )}
    </div>
  )
}

export default ItemsPage