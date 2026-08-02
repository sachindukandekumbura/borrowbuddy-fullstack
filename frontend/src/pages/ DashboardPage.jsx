import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  PackageOpen,
  RefreshCcw,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function DashboardPage({ items, requests, loading }) {
  const availableCount = items.filter(
    (item) => item.status === 'AVAILABLE'
  ).length

  const borrowedCount = items.filter(
    (item) => item.status === 'BORROWED'
  ).length

  const pendingCount = requests.filter(
    (request) => request.status === 'PENDING'
  ).length

  const returnedCount = requests.filter(
    (request) => request.status === 'RETURNED'
  ).length

  const statistics = [
    {
      label: 'Total Items',
      value: items.length,
      icon: Boxes,
      className: 'purple',
    },
    {
      label: 'Available Items',
      value: availableCount,
      icon: CheckCircle2,
      className: 'green',
    },
    {
      label: 'Borrowed Items',
      value: borrowedCount,
      icon: PackageOpen,
      className: 'orange',
    },
    {
      label: 'Pending Requests',
      value: pendingCount,
      icon: Clock3,
      className: 'blue',
    },
  ]

  const recentRequests = [...requests]
    .sort((first, second) => second.id - first.id)
    .slice(0, 5)

  const featuredItems = items.slice(0, 3)

  if (loading) {
    return (
      <div className="loading-state">
        <RefreshCcw className="spin" size={28} />
        <p>Loading BorrowBuddy data...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            SMART COMMUNITY LENDING
          </span>

          <h2>
            Make sharing items simple, safe and organized.
          </h2>

          <p>
            Manage available items, receive borrow requests
            and keep every return under control from one
            modern dashboard.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/items">
              Browse items
              <ArrowRight size={18} />
            </Link>

            <Link className="light-button" to="/requests">
              Manage requests
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle circle-one" />
          <div className="hero-circle circle-two" />

          <div className="floating-card floating-card-top">
            <span>📷</span>
            <div>
              <strong>Camera</strong>
              <small>Ready to borrow</small>
            </div>
          </div>

          <div className="hero-package">📦</div>

          <div className="floating-card floating-card-bottom">
            <span>✓</span>
            <div>
              <strong>Request approved</strong>
              <small>Item is ready</small>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {statistics.map((statistic) => {
          const Icon = statistic.icon

          return (
            <article
              className="stat-card"
              key={statistic.label}
            >
              <div
                className={`stat-icon ${statistic.className}`}
              >
                <Icon size={23} />
              </div>

              <div>
                <span>{statistic.label}</span>
                <strong>{statistic.value}</strong>
              </div>
            </article>
          )
        })}
      </section>

      <section className="dashboard-columns">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">RECENT ACTIVITY</p>
              <h3>Latest borrow requests</h3>
            </div>

            <Link className="text-link" to="/requests">
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="small-empty-state">
              <Clock3 size={30} />
              <strong>No requests yet</strong>
              <span>
                New borrow requests will appear here.
              </span>
            </div>
          ) : (
            <div className="activity-list">
              {recentRequests.map((request) => (
                <div
                  className="activity-row"
                  key={request.id}
                >
                  <div className="activity-avatar">
                    {request.borrowerName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="activity-copy">
                    <strong>{request.borrowerName}</strong>
                    <span>
                      Requested {request.item?.name || 'Item'}
                    </span>
                  </div>

                  <span
                    className={`status-pill ${request.status?.toLowerCase()}`}
                  >
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">QUICK VIEW</p>
              <h3>Recently added items</h3>
            </div>

            <Link className="text-link" to="/items">
              View items
              <ArrowRight size={15} />
            </Link>
          </div>

          {featuredItems.length === 0 ? (
            <div className="small-empty-state">
              <Boxes size={30} />
              <strong>No items added</strong>
              <span>Add your first community item.</span>
            </div>
          ) : (
            <div className="mini-item-list">
              {featuredItems.map((item) => (
                <div className="mini-item" key={item.id}>
                  <div className="mini-item-icon">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" />
                    ) : (
                      <PackageOpen size={22} />
                    )}
                  </div>

                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.category} · {item.location}
                    </span>
                  </div>

                  <span
                    className={`availability-dot ${item.status?.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="returned-summary">
            <RefreshCcw size={18} />
            <span>
              <strong>{returnedCount}</strong> successfully
              returned requests
            </span>
          </div>
        </article>
      </section>
    </div>
  )
}

export default DashboardPage