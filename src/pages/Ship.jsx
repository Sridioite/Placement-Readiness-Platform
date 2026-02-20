import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Lock, CheckCircle2, AlertTriangle } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import { getShippedStatus } from '../utils/proofSystem'

export default function Ship() {
  const navigate = useNavigate()
  const [status, setStatus] = useState({})

  useEffect(() => {
    setStatus(getShippedStatus())
  }, [])

  if (!status.isShipped) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Ship Platform</h2>
          <p className="text-gray-600 mt-2">
            Deploy the Placement Readiness Platform
          </p>
        </div>

        {/* Locked State */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-300">
          <CardContent className="p-12 text-center">
            <Lock className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Shipping Locked
            </h3>
            <p className="text-gray-700 mb-6">
              Complete all test checklist items before shipping.
            </p>
            
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg border-2 border-red-300 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Requirements:</p>
                <p className="text-sm text-gray-600">
                  {!status.stepsComplete && `• Complete all ${status.totalSteps} steps`}
                  {!status.checklistComplete && ' • Pass all 10 tests'}
                  {!status.linksProvided && ' • Provide proof links'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/prp/proof')}
                className="flex-1 bg-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go to Proof Page
              </button>
              <button
                onClick={() => navigate('/prp/07-test')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go to Test Checklist
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Why Locked */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Why is shipping locked?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                To ensure quality and reliability, all core features must be tested before deployment.
              </p>
              <p>
                <strong>Required tests include:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Input validation</li>
                <li>Skills extraction</li>
                <li>Score calculation</li>
                <li>Data persistence</li>
                <li>Export functionality</li>
                <li>Error handling</li>
              </ul>
              <p className="mt-4">
                Complete the test checklist to unlock shipping.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Unlocked State
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Ship Platform</h2>
        <p className="text-gray-600 mt-2">
          Deploy the Placement Readiness Platform
        </p>
      </div>

      {/* Unlocked State */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 mb-6">
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Ship! 🎉
          </h3>
          <p className="text-gray-700 mb-6">
            All tests have passed. The platform is ready for deployment.
          </p>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg border-2 border-green-300 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                All Requirements Met
              </p>
              <p className="text-sm text-gray-600">
                {status.totalSteps} steps • 10 tests • 3 proof links
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Options */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Deployment Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2">Vercel Deployment</h4>
              <p className="text-sm text-gray-600 mb-3">
                Deploy to Vercel for instant global CDN and automatic HTTPS.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs mb-3">
                <div>npm run build</div>
                <div>vercel --prod</div>
              </div>
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Deploy to Vercel →
              </a>
            </div>

            <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2">Netlify Deployment</h4>
              <p className="text-sm text-gray-600 mb-3">
                Deploy to Netlify with continuous deployment from Git.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs mb-3">
                <div>npm run build</div>
                <div>netlify deploy --prod</div>
              </div>
              <a
                href="https://app.netlify.com/start"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Deploy to Netlify →
              </a>
            </div>

            <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2">GitHub Pages</h4>
              <p className="text-sm text-gray-600 mb-3">
                Deploy to GitHub Pages for free static hosting.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs mb-3">
                <div>npm run build</div>
                <div>gh-pages -d dist</div>
              </div>
              <a
                href="https://pages.github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Learn More →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-deployment Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>All tests passed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Build completes successfully</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>No console errors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>localStorage features work</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Responsive design verified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
