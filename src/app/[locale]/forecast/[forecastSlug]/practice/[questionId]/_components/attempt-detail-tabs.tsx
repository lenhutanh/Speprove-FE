'use client'

import { cn } from '@/lib/utils'
import { Tabs, ScrollableTabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttemptDetail } from '@/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PronunciationPopover } from './attempt-detail-popovers'
import { PauseToken, RangeToken, WordToken } from './attempt-detail-tokens'
import {
  CriteriaTab,
  HIGHLIGHT_CLASS,
  ISSUE_SEVERITY_CLASS,
  SCORE_KEYS,
  TAB_LABELS,
} from './attempt-detail-types'
import {
  buildWordsFromTranscript,
  getEvaluationIssues,
  getHighlightClass,
  getHighlightedIndexes,
  getIssueForWord,
  getPauseIssues,
} from './attempt-detail-utils'
import { AttemptFluencySummary } from './attempt-fluency-summary'

export function AttemptDetailTabs({ detail }: { detail: AttemptDetail }) {
  const tAttempt = useTranslations('practice.attempt')
  const tCriteria = useTranslations('practice.attempt.criteria')
  const [activeTab, setActiveTab] = useState<CriteriaTab>('fluency')


  const words =
    detail.wordAssessments?.length != null && detail.wordAssessments.length > 0
      ? detail.wordAssessments
      : buildWordsFromTranscript(detail.transcript)
  const highlightedIndexes = getHighlightedIndexes(activeTab, words, detail)
  const lexicalIssues = getEvaluationIssues(detail.evaluation?.lexical, words)
  const grammarIssues = getEvaluationIssues(detail.evaluation?.grammar, words)
  const pauseIssues = getPauseIssues(detail.fluencyMetrics)

  const renderRangeTokens = () => {
    const issues = activeTab === 'lexical' ? lexicalIssues : grammarIssues
    const nodes: React.ReactNode[] = []
    let index = 0

    while (index < words.length) {
      const word = words[index]
      const issue = getIssueForWord(word.wordIndex, issues)

      if (!issue) {
        nodes.push(
          <WordToken
            key={word.wordIndex}
            word={word}
            isHighlighted={false}
            highlightClass={HIGHLIGHT_CLASS[activeTab]}
          />,
        )
        index += 1
        continue
      }

      const rangeWords = words.slice(index).filter((rangeWord) => {
        return (
          rangeWord.wordIndex >= issue.startWordIndex &&
          rangeWord.wordIndex <= issue.endWordIndex
        )
      })

      nodes.push(
        <RangeToken
          key={`${activeTab}-${issue.startWordIndex}-${issue.endWordIndex}`}
          words={rangeWords}
          issue={issue}
          highlightClass={ISSUE_SEVERITY_CLASS[issue.severity ?? 'minor']}
        />,
      )
      index += Math.max(rangeWords.length, 1)
    }

    return nodes
  }

  const renderWordTokens = () => {
    return words.flatMap((word) => {
      const isHighlighted = highlightedIndexes.has(word.wordIndex)
      const pause = pauseIssues.find(
        (item) => item.afterWordIndex === word.wordIndex,
      )
      const popoverContent =
        activeTab === 'pronunciation'
          ? (isOpen: boolean) => (
            <PronunciationPopover
              attemptId={detail.id}
              isOpen={isOpen}
              word={word}
              audioUrl={detail.audioUrl}
            />
          )
          : undefined

      const token = (
        <WordToken
          key={word.wordIndex}
          word={word}
          isHighlighted={isHighlighted}
          highlightClass={getHighlightClass(activeTab, word)}
          popoverContent={popoverContent}
        />
      )

      if (activeTab !== 'fluency' || !pause) return [token]

      return [
        token,
        <PauseToken key={`pause-${word.wordIndex}`} pause={pause} />,
      ]
    })
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as CriteriaTab)}
    >
      <ScrollableTabsList
        variant='default'
        containerClassName='w-full p-3 pb-0'
      >
        {(Object.keys(TAB_LABELS) as CriteriaTab[]).map((tab) => {
          const isActive = activeTab === tab
          const score = detail.scores?.[SCORE_KEYS[tab]]

          return (
            <TabsTrigger
              key={tab}
              value={tab}
              className='flex-1 px-3 py-1.5 text-sm font-medium gap-1.5 cursor-pointer'
            >
              {tCriteria(tab)}
              {score != null && (
                <span
                  className={cn(
                    'rounded-full px-2 py-px text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {score}
                </span>
              )}
            </TabsTrigger>
          )
        })}
      </ScrollableTabsList>

      <div className='border-border border-b'>
        {/* {activeTab === 'fluency' && (
          <AttemptFluencySummary
            fluencyMetrics={detail.fluencyMetrics}
            pauses={pauseIssues}
          />
        )} */}

        <div className='px-3 py-2.5'>
          <p className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
            {tAttempt('transcript')}
          </p>
          <div className='text-foreground text-sm leading-[2.5]'>
            {activeTab === 'lexical' || activeTab === 'grammar'
              ? renderRangeTokens()
              : renderWordTokens()}
          </div>
        </div>
      </div>
    </Tabs>
  )
}
