import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, RotateCcw, Info } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import { TEST_ITEMS, getChecklist, toggleChecklistItem, resetChecklist, getChecklistProgress } from '../utils/testChecklist'

export default function TestChecklist() {
  const [checklist, setChecklist] = useState({})
  const [progress, setProgress] = useState({ passed: 0, total: 10, isComplete: false })
  const [showHints, setShowHints] = useState({})

  useEffect(() => {
    loadChecklist()
  }, [])

  const loadChecklist = () => {
    setChecklist(getChecklist())
    setProgress(getChecklistProgress())
  }

  const handleToggle = (itemId) => {
    const updated = toggleChecklistItem(itemId)
    setChecklist(updated)
    setProgress(getChecklistProgress())
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the checklist? This will uncheck all items.')) {
      const empty = resetChecklist()
      setChecklist(empty)
      setProgress(getChecklistProgress())
    }
  }

  const toggleHint = (itemId) => {
    setShowHints(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Test Checklist</h2>
        <p className="text-gray-600 mt-2">
          Complete all tests before shipping the platform
        </p>
      </div>

      {/* Progress Summary */}
      <Card className={`mb-6 ${progress.isComplete ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Tests Passed: {progress.passed} / {progress.total}
              </h3>
              {!progress.isComplete && (
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="font-semibold">Fix issues before shipping.</p>
                </div>
              )}
              {progress.isComplete && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-semibold">All tests passed! Ready to ship.</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-primary">
                {Math.round((progress.passed / progress.total) * 100)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Items */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Items</CardTitle>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Checklist
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TEST_ITEMS.map((item, idx) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      checklist[item.id]
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {checklist[item.id] && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <label
                        className={`font-medium cursor-pointer ${
                          checklist[item.id] ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                        onClick={() => handleToggle(item.id)}
                      >
                        {idx + 1}. {item.label}
                      </label>
                      <button
                        onClick={() => toggleHint(item.id)}
                        className="text-primary hover:text-indigo-700 transition-colors"
                        title="Show test hint"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hint */}
                    {showHints[item.id] && (
                      <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <strong>How to test:</strong> {item.hint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>1. Test each item:</strong> Click the info icon (ⓘ) to see how to test each feature.
            </p>
            <p>
              <strong>2. Check the box:</strong> Once you've verified the feature works correctly, check the box.
            </p>
            <p>
              <strong>3. Complete all tests:</strong> All 10 items must be checked to unlock shipping.
            </p>
            <p>
              <strong>4. Ship when ready:</strong> Once all tests pass, navigate to the Ship page to deploy.
            </p>
            <p className="text-xs text-gray-600 mt-4">
              Note: Checklist state is saved in localStorage and persists across page refreshes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
