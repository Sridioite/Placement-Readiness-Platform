import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, FileText, Edit } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import { getHistory, deleteAnalysis } from '../utils/historyStorage'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [hasCorruptedEntries, setHasCorruptedEntries] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const rawData = localStorage.getItem('placement_analysis_history')
      if (rawData) {
        const parsed = JSON.parse(rawData)
        const validCount = getHistory().length
        if (Array.isArray(parsed) && parsed.length > validCount) {
          setHasCorruptedEntries(true)
        }
      }
    } catch (error) {
      console.error('Error checking history:', error)
    }
    setHistory(getHistory())
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id)
      loadHistory()
    }
  }

  const handleViewAnalysis = (id) => {
    console.log('History - Viewing analysis with ID:', id)
    navigate(`/app/results?id=${id}`)
  }

  const handleEditAnalysis = (item, e) => {
    e.stopPropagation()
    // Navigate to analyze page with pre-filled data
    navigate('/app/analyze', { 
      state: { 
        editMode: true,
        company: item.company,
        role: item.role,
        jdText: item.jdText,
        originalId: item.id
      } 
    })
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Analysis History</h2>

      {hasCorruptedEntries && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ⚠️ One or more saved entries couldn't be loaded due to data corruption. They have been skipped. Create a new analysis to continue.
          </p>
        </div>
      )}

      {history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No analysis history yet</p>
            <button
              onClick={() => navigate('/app/analyze')}
              className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Analyze Your First Job
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.company || 'Unknown Company'}
                      </h3>
                      <span className="px-3 py-1 bg-indigo-100 text-primary text-sm font-semibold rounded-full">
                        Score: {item.readinessScore}/100
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      {item.role || 'No role specified'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>
                        {Object.keys(item.extractedSkills).length} skill categories
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.keys(item.extractedSkills).slice(0, 4).map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {category}
                        </span>
                      ))}
                      {Object.keys(item.extractedSkills).length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{Object.keys(item.extractedSkills).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewAnalysis(item.id)
                      }}
                      className="px-4 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                      title="View saved analysis"
                    >
                      View Analysis
                    </button>
                    <button
                      onClick={(e) => handleEditAnalysis(item, e)}
                      className="p-2 text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit and re-analyze"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
