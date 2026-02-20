import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Lightbulb, Target, Download, Copy, Check, AlertCircle } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import CircularProgress from '../components/CircularProgress'
import { getAnalysisById } from '../utils/historyStorage'
import { updateAnalysisInHistory } from '../utils/updateHistory'
import { copy7DayPlan, copyRoundChecklist, copy10Questions, downloadAsText } from '../utils/exportUtils'

export default function Results() {
  const [searchParams] = useSearchParams()
  const [analysis, setAnalysis] = useState(null)
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({})
  const [liveScore, setLiveScore] = useState(0)
  const [copiedItem, setCopiedItem] = useState(null)

  useEffect(() => {
    const id = searchParams.get('id')
    console.log('Results page - ID from URL:', id)
    if (id) {
      const data = getAnalysisById(id)
      console.log('Results page - Loaded data:', data)
      if (data) {
        setAnalysis(data)
        setSkillConfidenceMap(data.skillConfidenceMap || {})
        setLiveScore(data.readinessScore)
      } else {
        console.error('Results page - No data found for ID:', id)
      }
    } else {
      console.error('Results page - No ID in URL')
    }
  }, [searchParams])

  const toggleSkillConfidence = (skill) => {
    const currentConfidence = skillConfidenceMap[skill] || 'practice'
    let newConfidence
    
    // Cycle through: practice → know → completed → practice
    if (currentConfidence === 'practice') {
      newConfidence = 'know'
    } else if (currentConfidence === 'know') {
      newConfidence = 'completed'
    } else {
      newConfidence = 'practice'
    }
    
    const newMap = {
      ...skillConfidenceMap,
      [skill]: newConfidence
    }
    
    setSkillConfidenceMap(newMap)
    
    // Calculate new score
    const baseScore = analysis.readinessScore
    let adjustment = 0
    
    Object.entries(newMap).forEach(([_, confidence]) => {
      if (confidence === 'know') adjustment += 2
      else if (confidence === 'completed') adjustment += 2
      else adjustment -= 2
    })
    
    const newScore = Math.max(0, Math.min(100, baseScore + adjustment))
    setLiveScore(newScore)
    
    // Save to history
    const id = searchParams.get('id')
    if (id) {
      updateAnalysisInHistory(id, {
        skillConfidenceMap: newMap,
        readinessScore: newScore
      })
    }
  }

  const handleCopy = (type) => {
    switch(type) {
      case 'plan':
        copy7DayPlan(analysis.plan)
        break
      case 'checklist':
        copyRoundChecklist(analysis.checklist)
        break
      case 'questions':
        copy10Questions(analysis.questions)
        break
    }
    setCopiedItem(type)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const getWeakSkills = () => {
    const weak = []
    Object.entries(skillConfidenceMap).forEach(([skill, confidence]) => {
      if (confidence === 'practice') {
        weak.push(skill)
      }
    })
    return weak.slice(0, 3)
  }

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
            <CircularProgress value={liveScore} max={100} />
          </CardContent>
          <div className="px-6 pb-4 text-center text-sm text-gray-600">
            {liveScore !== analysis.readinessScore && (
              <p className="text-primary font-medium">
                Score updated based on your confidence!
              </p>
            )}
          </div>
        </Card>

        {/* Key Skills Extracted */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Key Skills Extracted
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Click skills to mark your confidence level
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analysis.extractedSkills).map(([category, skills]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => {
                      const confidence = skillConfidenceMap[skill] || 'practice'
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleSkillConfidence(skill)}
                          className={`px-3 py-1 text-sm font-medium rounded-full transition-all cursor-pointer ${
                            confidence === 'completed'
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                              : confidence === 'know'
                              ? 'bg-green-100 text-green-700 border-2 border-green-500'
                              : 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                          }`}
                          title={
                            confidence === 'completed' 
                              ? 'Completed practice' 
                              : confidence === 'know' 
                              ? 'I know this' 
                              : 'Need practice'
                          }
                        >
                          {confidence === 'completed' ? '✓✓ ' : confidence === 'know' ? '✓ ' : '○ '}
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-gray-700">
              <p><strong>Legend:</strong> ○ Need practice (-2 points) | ✓ I know this (+2 points) | ✓✓ Completed practice (+2 points)</p>
              <p className="mt-1 text-xs text-gray-600">Click skills to cycle through states</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Tools */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <button
              onClick={() => handleCopy('plan')}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 hover:border-primary hover:bg-indigo-50 rounded-lg transition-all"
            >
              {copiedItem === 'plan' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm font-medium">Copy 7-Day Plan</span>
            </button>
            <button
              onClick={() => handleCopy('checklist')}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 hover:border-primary hover:bg-indigo-50 rounded-lg transition-all"
            >
              {copiedItem === 'checklist' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm font-medium">Copy Checklist</span>
            </button>
            <button
              onClick={() => handleCopy('questions')}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 hover:border-primary hover:bg-indigo-50 rounded-lg transition-all"
            >
              {copiedItem === 'questions' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm font-medium">Copy Questions</span>
            </button>
            <button
              onClick={() => downloadAsText(analysis)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download TXT</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Practice Tracker */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Practice Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Need Practice */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                  {Object.values(skillConfidenceMap).filter(c => c === 'practice').length}
                </span>
                Need Practice
              </h4>
              <div className="space-y-2">
                {Object.entries(skillConfidenceMap).filter(([_, conf]) => conf === 'practice').length === 0 ? (
                  <p className="text-sm text-gray-600 italic">No skills marked for practice. Great job!</p>
                ) : (
                  Object.entries(skillConfidenceMap)
                    .filter(([_, conf]) => conf === 'practice')
                    .map(([skill, _], idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
                        <span className="text-sm text-gray-700">{skill}</span>
                        <button
                          onClick={() => toggleSkillConfidence(skill)}
                          className="text-xs px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                        >
                          Mark as Known
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Completed */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  {Object.values(skillConfidenceMap).filter(c => c === 'completed').length}
                </span>
                Completed Practice
              </h4>
              <div className="space-y-2">
                {Object.entries(skillConfidenceMap).filter(([_, conf]) => conf === 'completed').length === 0 ? (
                  <p className="text-sm text-gray-600 italic">Start practicing to track your progress!</p>
                ) : (
                  Object.entries(skillConfidenceMap)
                    .filter(([_, conf]) => conf === 'completed')
                    .map(([skill, _], idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                        <span className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="text-blue-600">✓✓</span>
                          {skill}
                        </span>
                        <span className="text-xs text-blue-600 font-medium">+2 pts</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Practice Progress</p>
                <p className="text-xs text-gray-600 mt-1">
                  {Object.values(skillConfidenceMap).filter(c => c === 'completed').length} completed • 
                  {' '}{Object.values(skillConfidenceMap).filter(c => c === 'know').length} already known • 
                  {' '}{Object.values(skillConfidenceMap).filter(c => c === 'practice').length} to practice
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((Object.values(skillConfidenceMap).filter(c => c === 'completed' || c === 'know').length / 
                    Math.max(Object.keys(skillConfidenceMap).length, 1)) * 100)}%
                </p>
                <p className="text-xs text-gray-600">Mastery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
      <Card className="mb-6">
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

      {/* Action Next Box */}
      {getWeakSkills().length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Action Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Top Skills to Focus On:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getWeakSkills().map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full border-2 border-orange-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border-2 border-orange-300">
                <p className="text-gray-900 font-semibold mb-2">📌 Recommended Next Step:</p>
                <p className="text-gray-700">Start Day 1 plan now. Focus on basics and core CS concepts to build a strong foundation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
