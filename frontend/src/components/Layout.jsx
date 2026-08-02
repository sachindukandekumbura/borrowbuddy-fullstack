import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PackageCheck,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Layout({ children, notice, onDismissNotice }) {
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date())

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <PackageCheck size={27} />
          </div>

          <div className="brand-copy">
            <strong>BorrowBuddy</strong>
            <span>Share more. Own less.</span>
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <Boxes size={19} />
            Items
          </NavLink>

          <NavLink
            to="/requests"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <ClipboardList size={19} />
            Borrow Requests
          </NavLink>
        </nav>

        <div className="sidebar-card">
          <span className="sidebar-card-icon">🌱</span>
          <strong>Community sharing</strong>
          <p>
            Help useful items reach more people instead of
            staying unused.
          </p>
        </div>

        <div className="sidebar-footer">
          React + Spring Boot
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-label">
              Item Lending Management System
            </p>
            <h1>Welcome to BorrowBuddy</h1>
          </div>

          <div className="topbar-user">
            <div>
              <strong>Administrator</strong>
              <span>{today}</span>
            </div>

            <div className="avatar">BB</div>
          </div>
        </header>

        {notice && (
          <div
            className={`notice ${
              notice.type === 'error'
                ? 'notice-error'
                : 'notice-success'
            }`}
          >
            <span>{notice.message}</span>

            <button
              type="button"
              onClick={onDismissNotice}
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {children}
      </main>
    </div>
  )
}

export default Layout