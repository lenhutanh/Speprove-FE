'use client'

import { ScrollableTabsList, Tabs, TabsTrigger } from '@/components/ui/tabs'
import { BAND_SCORE_TEXT_VARIANTS } from '@/constants'
import { cn, getBandScoreMeta } from '@/lib'
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

export function AttemptDetailTabs({ detail }: { detail: AttemptDetail }) {
  const tAttempt = useTranslations('practice.attempt')
  const tCriteria = useTranslations('practice.attempt.criteria')
  const [activeTab, setActiveTab] = useState<CriteriaTab>('fluency')

  const words =
    detail.wordAssessments?.length != null && detail.wordAssessments.length > 0
      ? detail.wordAssessments
      : buildWordsFromTranscript(detail.transcript)
  const highlightedIndexes = getHighlightedIndexes(activeTab, words, detail)
  const lexicalIssues = getEvaluationIssues(
    detail.evaluation?.lexical?.issues,
    words,
  )
  const grammarIssues = getEvaluationIssues(
    detail.evaluation?.grammar?.issues,
    words,
  )
  const pauseIssues = getPauseIssues(detail.fluencyMetrics)

  const criterionByTab = {
    fluency: detail.evaluation?.fluency,
    pronunciation: detail.evaluation?.pronunciation,
    lexical: detail.evaluation?.lexical,
    grammar: detail.evaluation?.grammar,
  } satisfies Record<
    CriteriaTab,
    { strengths?: string[] | null; limitations?: string[] | null } | undefined
  >

  const activeCriterion = criterionByTab[activeTab]
  const strengths = activeCriterion?.strengths
  const limitations = activeCriterion?.limitations
  const hasReview =
    (strengths != null && strengths.length > 0) ||
    (limitations != null && limitations.length > 0)

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
        containerClassName='w-full px-4 py-2'
      >
        {(Object.keys(TAB_LABELS) as CriteriaTab[]).map((tab) => {
          const score = detail.scores?.[SCORE_KEYS[tab]]
          const bandScoreMeta = getBandScoreMeta(score)

          return (
            <TabsTrigger
              key={tab}
              value={tab}
              className='flex-1 cursor-pointer gap-1.5 px-3 py-1.5 text-sm font-medium'
            >
              {tCriteria(tab)}
              {score != null && (
                <span
                  className={cn(
                    'text-sm font-bold transition-colors',
                    BAND_SCORE_TEXT_VARIANTS[bandScoreMeta.variant],
                  )}
                >
                  {score.toFixed(1)}
                </span>
              )}
            </TabsTrigger>
          )
        })}
      </ScrollableTabsList>

      <div>
        {/* {activeTab === 'fluency' && (
          <AttemptFluencySummary
            fluencyMetrics={detail.fluencyMetrics}
            pauses={pauseIssues}
          />
        )} */}

        <div className='border-border border-t p-4'>
          <p className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
            {tAttempt('transcript')}
          </p>
          <div className='text-foreground text-sm leading-[1.8]'>
            {activeTab === 'lexical' || activeTab === 'grammar'
              ? renderRangeTokens()
              : renderWordTokens()}
          </div>
        </div>

        {hasReview && (
          <>
            <div className='border-border bg-background space-y-4 border-t p-4'>
              <p className='text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase'>
                {tAttempt('feedback')}
              </p>
              {strengths && strengths.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-sm font-semibold tracking-wide text-emerald-600 dark:text-emerald-400'>
                    {tAttempt('strengths')}
                  </p>
                  <ul className='text-foreground list-disc space-y-1 pl-5 text-sm leading-relaxed'>
                    {strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}
              {limitations && limitations.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-sm font-semibold tracking-wide text-amber-600 dark:text-amber-400'>
                    {tAttempt('limitations')}
                  </p>
                  <ul className='text-foreground list-disc space-y-1 pl-5 text-sm leading-relaxed'>
                    {limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Tabs>
  )
}
