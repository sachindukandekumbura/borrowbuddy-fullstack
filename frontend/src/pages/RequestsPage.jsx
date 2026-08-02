import { useMemo, useState } from 'react'
import {
  Check,
  ClipboardList,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

function RequestsPage({
  requests,
  loading,
  onStatusChange,
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('ALL')

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        !searchValue ||
        request.borrowerName
          ?.toLowerCase()
          .includes(searchValue) ||
        request.item?.name
          ?.toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === 'ALL' ||
        request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">REQUEST MANAGEMENT</p>
          <h2>Borrow requests</h2>
          <p className="page-description">
            Review requests and update the borrowing
            workflow.
          </p>
        </div>
      </div>

      <section className="filter-bar">
        <div className="search-control">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search item or borrower..."
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
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="RETURNED">Returned</option>
        </select>
      </section>

      {loading ? (
        <div className="loading-state">
          Loading requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ClipboardList size={38} />
          </div>

          <h3>No borrow requests found</h3>

          <p>
            Requests created from the Items page will
            appear here.
          </p>
        </div>
      ) : (
        <section className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>
                        {request.item?.name ||
                          'Unknown item'}
                      </strong>
                    </td>

                    <td>{request.borrowerName}</td>
                    <td>{request.borrowDate}</td>
                    <td>{request.returnDate}</td>

                    <td className="message-cell">
                      {request.message || '—'}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${request.status?.toLowerCase()}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td>
                      <div className="request-actions">
                        {request.status === 'PENDING' && (
                          <>
                            <button
                              className="action-icon approve"
                              type="button"
                              title="Approve request"
                              onClick={() =>
                                onStatusChange(
                                  request.id,
                                  'APPROVED'
                                )
                              }
                            >
                              <Check size={17} />
                            </button>

                            <button
                              className="action-icon reject"
                              type="button"
                              title="Reject request"
                              onClick={() =>
                                onStatusChange(
                                  request.id,
                                  'REJECTED'
                                )
                              }
                            >
                              <X size={17} />
                            </button>
                          </>
                        )}

                        {request.status ===
                          'APPROVED' && (
                          <button
                            className="return-button"
                            type="button"
                            onClick={() =>
                              onStatusChange(
                                request.id,
                                'RETURNED'
                              )
                            }
                          >
                            <RotateCcw size={15} />
                            Mark Returned
                          </button>
                        )}

                        {(request.status === 'REJECTED' ||
                          request.status ===
                            'RETURNED') && (
                          <span className="completed-label">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default RequestsPage