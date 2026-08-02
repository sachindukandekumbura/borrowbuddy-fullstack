import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ItemsPage from './pages/ItemsPage'
import RequestsPage from './pages/RequestsPage'
import api from './services/api'

function App() {
  const [items, setItems] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)

  const showNotice = (message, type = 'success') => {
    setNotice({
      message,
      type,
    })
  }

  const loadData = useCallback(async () => {
    setLoading(true)

    const [itemsResult, requestsResult] =
      await Promise.allSettled([
        api.get('/items'),
        api.get('/requests'),
      ])

    let connectionError = false

    if (itemsResult.status === 'fulfilled') {
      setItems(itemsResult.value.data)
    } else {
      setItems([])
      connectionError = true
    }

    if (requestsResult.status === 'fulfilled') {
      setRequests(requestsResult.value.data)
    } else {
      setRequests([])
      connectionError = true
    }

    if (connectionError) {
      showNotice(
        'Some backend endpoints are not ready. Complete and run the Spring Boot controllers on port 8080.',
        'error'
      )
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const saveItem = async (item) => {
    try {
      if (item.id) {
        await api.put(`/items/${item.id}`, item)
        showNotice('Item updated successfully.')
      } else {
        await api.post('/items', item)
        showNotice('New item added successfully.')
      }

      await loadData()
      return true
    } catch (error) {
      console.error(error)
      showNotice(
        error.response?.data?.message ||
          'Could not save the item.',
        'error'
      )

      return false
    }
  }

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`)
      showNotice('Item deleted successfully.')
      await loadData()
    } catch (error) {
      console.error(error)
      showNotice(
        'Could not delete this item. It may have connected borrow requests.',
        'error'
      )
    }
  }

  const sendBorrowRequest = async (
    itemId,
    requestData
  ) => {
    try {
      await api.post(
        `/requests/item/${itemId}`,
        requestData
      )

      showNotice('Borrow request sent successfully.')
      await loadData()

      return true
    } catch (error) {
      console.error(error)
      showNotice(
        error.response?.data?.message ||
          'Could not send the borrow request.',
        'error'
      )

      return false
    }
  }

  const changeRequestStatus = async (
    requestId,
    status
  ) => {
    try {
      await api.patch(
        `/requests/${requestId}/status`,
        { status }
      )

      showNotice(`Request changed to ${status}.`)
      await loadData()
    } catch (error) {
      console.error(error)
      showNotice(
        error.response?.data?.message ||
          'Could not update the request status.',
        'error'
      )
    }
  }

  return (
    <Layout
      notice={notice}
      onDismissNotice={() => setNotice(null)}
    >
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              items={items}
              requests={requests}
              loading={loading}
            />
          }
        />

        <Route
          path="/items"
          element={
            <ItemsPage
              items={items}
              loading={loading}
              onSaveItem={saveItem}
              onDeleteItem={deleteItem}
              onBorrowItem={sendBorrowRequest}
            />
          }
        />

        <Route
          path="/requests"
          element={
            <RequestsPage
              requests={requests}
              loading={loading}
              onStatusChange={changeRequestStatus}
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  )
}

export default App