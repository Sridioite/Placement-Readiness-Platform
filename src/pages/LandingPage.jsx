import { useNavigate } from 'react-router-dom'
import { Code, Video, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Ace Your Placement
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice, assess, and prepare for your dream job
          </p>
          <button
            onClick={() => navigate('/app')}
            className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <Code className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Practice Problems</h3>
            <p className="text-gray-600">
              Solve coding challenges to sharpen your skills
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <Video className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mock Interviews</h3>
            <p className="text-gray-600">
              Practice with realistic interview scenarios
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement with detailed analytics
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-600">
        <p>&copy; 2024 Placement Readiness Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
