import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Lightbulb, Target, Download, Copy, Check, AlertCircle, Building2, MapPin } from 'lucide-react'
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
        
        // Initialize skillConfidenceMap with all extracted skills
        const initialMap = data.skillConfidenceMap || {}
        
        // Add all extracted skills if not already in map
        Object.values(data.extractedSkills).forEach(skillArray => {
          skillArray.forEach(skill => {
            if (!initialMap[skill]) {
              initialMap[skill] = 'practice' // Default to 'practice'
            }
          })
        })
        
        setSkillConfidenceMap(initialMap)
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
    updateScore(newMap)
  }

  const updateScore = (newMap) => {
    // Calculate new score based on changes from default "practice" state
    const baseScore = analysis.readinessScore
    let adjustment = 0
    
    // Only count adjustments for skills that are NOT in default "practice" state
    Object.entries(newMap).forEach(([_, confidence]) => {
      if (confidence === 'know') adjustment += 2
      else if (confidence === 'completed') adjustment += 2
      // Don't subtract for 'practice' - it's the default/neutral state
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
    return weak // Return all skills marked as "practice"
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
              <p><strong>Legend:</strong> ○ Need practice (neutral) | ✓ I know this (+2 points) | ✓✓ Completed practice (+2 points)</p>
              <p className="mt-1 text-xs text-gray-600">Click skills to cycle through states. Base score starts neutral, gains points for known/completed skills.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Intel */}
      {analysis.companyIntel && (
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Company Intel
            </CardTitle>
            <p className="text-xs text-gray-600 mt-1">
              Demo Mode: Company intel generated heuristically
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Company Size</p>
                <p className="font-semibold text-gray-900">{analysis.companyIntel.size}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Industry</p>
                <p className="font-semibold text-gray-900">{analysis.companyIntel.industry}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Company Type</p>
                <p className="font-semibold text-gray-900 capitalize">{analysis.companyIntel.sizeCategory}</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border-2 border-purple-300">
              <h4 className="font-semibold text-gray-900 mb-3">Typical Hiring Focus</h4>
              <ul className="space-y-2">
                {analysis.companyIntel.hiringFocus.map((focus, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping */}
      {analysis.roundMapping && analysis.roundMapping.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Interview Round Mapping
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Expected interview process based on company size and role requirements
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-6">
                {analysis.roundMapping.map((round, idx) => (
                  <div key={idx} className="relative pl-16">
                    {/* Round Number Circle */}
                    <div className="absolute left-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {round.number}
                    </div>
                    
                    {/* Round Content */}
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">{round.title}</h4>
                        <span className="text-xs bg-indigo-100 text-primary px-2 py-1 rounded font-medium">
                          {round.duration}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{round.description}</p>
                      
                      <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">💡 Why this round matters:</p>
                        <p className="text-xs text-blue-800">{round.why}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Focus Areas:</p>
                        <div className="flex flex-wrap gap-2">
                          {round.focus.map((item, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-white border border-gray-300 rounded text-gray-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          <p className="text-sm text-gray-600 mt-2">
            Mark your confidence level for each skill. Click skills to cycle through states.
          </p>
        </CardHeader>
        <CardContent>
          {/* All Skills by Category */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">All Extracted Skills</h4>
            <div className="space-y-4">
              {Object.entries(analysis.extractedSkills).map(([category, skills]) => (
                <div key={category} className="p-4 bg-white rounded-lg border border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">{category}</h5>
                  <div className="grid md:grid-cols-2 gap-2">
                    {skills.map((skill, idx) => {
                      const confidence = skillConfidenceMap[skill] || 'practice'
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <span className="text-sm text-gray-700">{skill}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                const newMap = { ...skillConfidenceMap, [skill]: 'practice' }
                                setSkillConfidenceMap(newMap)
                                updateScore(newMap)
                              }}
                              className={`px-2 py-1 text-xs rounded transition-all ${
                                confidence === 'practice'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-200 text-gray-600 hover:bg-orange-100'
                              }`}
                              title="Need practice"
                            >
                              ○
                            </button>
                            <button
                              onClick={() => {
                                const newMap = { ...skillConfidenceMap, [skill]: 'know' }
                                setSkillConfidenceMap(newMap)
                                updateScore(newMap)
                              }}
                              className={`px-2 py-1 text-xs rounded transition-all ${
                                confidence === 'know'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                              }`}
                              title="I know this"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => {
                                const newMap = { ...skillConfidenceMap, [skill]: 'completed' }
                                setSkillConfidenceMap(newMap)
                                updateScore(newMap)
                              }}
                              className={`px-2 py-1 text-xs rounded transition-all ${
                                confidence === 'completed'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-600 hover:bg-blue-100'
                              }`}
                              title="Completed practice"
                            >
                              ✓✓
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary by Status */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Need Practice */}
            <div className="p-4 bg-white rounded-lg border-2 border-orange-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Need Practice</h4>
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {Object.values(skillConfidenceMap).filter(c => c === 'practice').length}
                </span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(skillConfidenceMap)
                  .filter(([_, conf]) => conf === 'practice')
                  .map(([skill, _], idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-orange-500">○</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                {Object.values(skillConfidenceMap).filter(c => c === 'practice').length === 0 && (
                  <p className="text-sm text-gray-500 italic">None</p>
                )}
              </div>
            </div>

            {/* I Know This */}
            <div className="p-4 bg-white rounded-lg border-2 border-green-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">I Know This</h4>
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {Object.values(skillConfidenceMap).filter(c => c === 'know').length}
                </span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(skillConfidenceMap)
                  .filter(([_, conf]) => conf === 'know')
                  .map(([skill, _], idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                {Object.values(skillConfidenceMap).filter(c => c === 'know').length === 0 && (
                  <p className="text-sm text-gray-500 italic">None</p>
                )}
              </div>
            </div>

            {/* Completed */}
            <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Completed</h4>
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {Object.values(skillConfidenceMap).filter(c => c === 'completed').length}
                </span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(skillConfidenceMap)
                  .filter(([_, conf]) => conf === 'completed')
                  .map(([skill, _], idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-blue-500">✓✓</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                {Object.values(skillConfidenceMap).filter(c => c === 'completed').length === 0 && (
                  <p className="text-sm text-gray-500 italic">None</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Overall Progress</p>
                <p className="text-xs text-gray-600 mt-1">
                  {Object.values(skillConfidenceMap).filter(c => c === 'completed').length} completed • 
                  {' '}{Object.values(skillConfidenceMap).filter(c => c === 'know').length} already known • 
                  {' '}{Object.values(skillConfidenceMap).filter(c => c === 'practice').length} to practice
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
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
              Action Next - Skills to Focus On
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  All Skills Marked "Need Practice" ({getWeakSkills().length} total):
                </h4>
                <div className="grid md:grid-cols-3 gap-2 mb-4">
                  {getWeakSkills().map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded border-2 border-orange-300"
                    >
                      <span className="text-sm font-medium text-gray-800">{skill}</span>
                      <button
                        onClick={() => toggleSkillConfidence(skill)}
                        className="text-xs px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                        title="Mark as known"
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-2 border-orange-300">
                <p className="text-gray-900 font-semibold mb-2">📌 Recommended Next Steps:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">1.</span>
                    <span><strong>Start with Day 1 plan</strong> - Focus on basics and core CS concepts to build a strong foundation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">2.</span>
                    <span><strong>Practice these skills daily</strong> - Dedicate 2-3 hours per day to hands-on coding and problem-solving.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">3.</span>
                    <span><strong>Track your progress</strong> - Mark skills as "Completed" once you've practiced and feel confident.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">4.</span>
                    <span><strong>Review the interview questions</strong> - Prepare answers for the 10 likely questions listed above.</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg border border-orange-300">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Your Focus Score</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {getWeakSkills().length} skills to practice • {Object.values(skillConfidenceMap).filter(c => c === 'know' || c === 'completed').length} skills mastered
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">
                    {getWeakSkills().length}
                  </p>
                  <p className="text-xs text-gray-600">To Practice</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
