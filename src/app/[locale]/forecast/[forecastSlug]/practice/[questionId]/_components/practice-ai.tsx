'use client'

import { AIResultType, ForecastQuestionType } from '@/types'
import { useState } from 'react'
import AIAssistant from './ai-assistant'

interface PracticeAIProps {
  question: ForecastQuestionType
}

const AI_OPTIONS = [
  { key: 'improve', label: 'Cải thiện câu trả lời' },
  { key: 'vocabulary', label: 'Gợi ý từ vựng nâng cao' },
  { key: 'ideas', label: 'Ý tưởng mở rộng câu trả lời' },
]

export default function PracticeAI({ question }: PracticeAIProps) {
  const [results, setResults] = useState<AIResultType[]>([])
  const [loading, setLoading] = useState(false)

  async function handleOption(key: string, label: string) {
    setLoading(true)
    try {
      // gọi API AI
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        body: JSON.stringify({ questionId: question._id, type: key }),
      })
      const data = await res.json()
      setResults((prev) => [{ label, content: data.result }, ...prev])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-background flex flex-1 flex-col overflow-hidden'>
      <AIAssistant
        results={results}
        options={AI_OPTIONS}
        loading={loading}
        onOption={handleOption}
      />
    </div>
  )
}
