import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Code, FileText, BookOpen, User, Sparkles, History } from 'lucide-react'

export default function DashboardLayout() {
  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/analyze', label: 'Analyze JD', icon: Sparkles },
    { to: '/app/history', label: 'History', icon: History },
    { to: '/app/practice', label: 'Practice', icon: Code },
    { to: '/app/assessments', label: 'Assessments', icon: FileText },
    { to: '/app/resources', label: 'Resources', icon: BookOpen },
    { to: '/app/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Placement Prep</h2>
        </div>
        <nav className="px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Placement Prep</h1>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
