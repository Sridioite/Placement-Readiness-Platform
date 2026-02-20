import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Lightbulb, Target } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import CircularProgress from '../components/CircularProgress'
import { getAnalysisById } from '../utils/historyStorage'

export default function Results() {
  const [searchParams] = useSearchParams()
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    const id = searchParams.get('id')
    console.log('Results page - ID from URL:', id)
    if (id) {
      const data = getAnalysisById(id)
      console.log('Results page - Loaded data:', data)
      if (data) {
        setAnalysis(data)
      } else {
        console.error('Results page - No data found for ID:', id)
      }
    } else {
      console.error('Results page - No ID in URL')
    }
  }, [searchParams])

  if (!analysis) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">No analysis found. Please analyze a job description first.</p>
            <button
              onClick={() => navigate('/app/analyze')}
              className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Analyze a Job
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">
            {analysis.company && <span className="font-semibold">{analysis.company}</span>}
            {analysis.company && analysis.role && ' - '}
            {analysis.role && <span>{analysis.role}</span>}
          </p>
          {analysis.createdAt && (
            <span className="text-sm text-gray-500">
              Analyzed on {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Readiness Score */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Readiness Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <CircularProgress value={analysis.readinessScore} max={100} />
          </CardContent>
        </Card>

        {/* Key Skills Extracted */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Key Skills Extracted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analysis.extractedSkills).map(([category, skills]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-primary text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Round-wise Preparation Checklist */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Round-wise Preparation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(analysis.checklist).map(([round, items]) => (
              <div key={round} className="space-y-3">
                <h4 className="font-semibold text-gray-900">{round}</h4>
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Preparation Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            7-Day Preparation Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analysis.plan).map(([day, tasks]) => (
              <div key={day} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">{day}</h4>
                <ul className="space-y-1">
                  {tasks.map((task, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Likely Interview Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            10 Likely Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.questions.map((question, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-800">{question}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
