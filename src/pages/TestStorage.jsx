import { useState } from 'react'
import { getHistory } from '../utils/historyStorage'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'

export default function TestStorage() {
  const [data, setData] = useState(null)

  const checkStorage = () => {
    const history = getHistory()
    console.log('Storage check:', history)
    setData(history)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Storage Test</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Check localStorage</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={checkStorage}
            className="bg-primary text-white px-4 py-2 rounded-lg mb-4"
          >
            Check Storage
          </button>
          
          {data && (
            <div>
              <p className="mb-2">Found {data.length} items in storage</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
