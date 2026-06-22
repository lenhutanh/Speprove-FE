'use client'

import { logo } from '@/assets'
import { Container } from '@/components/layout'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollableTabsList, Tabs, TabsTrigger } from '@/components/ui/tabs'
import { BAND_SCORE_TEXT_VARIANTS } from '@/constants'
import { Link } from '@/i18n/navigation'
import { cn, getBandScoreMeta } from '@/lib'
import { useCreditPackageListQuery } from '@/queries'
import route from '@/routes'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  CalendarDays,
  Check,
  ChevronRight,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageSquare,
  Mic,
  Search,
  Sparkles,
  TrendingUp,
  Volume2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

type FlowMode = 'forecast' | 'mock'
type SimMode = 'fluency' | 'pronunciation' | 'lexical' | 'grammar'

export default function LandingPage() {
  const t = useTranslations('home')
  const [activeFlow, setActiveFlow] = useState<FlowMode>('forecast')
  const [activeSim, setActiveSim] = useState<SimMode>('fluency')
  const [activeStep, setActiveStep] = useState(0)

  const handleFlowChange = (flow: FlowMode) => {
    setActiveFlow(flow)
    setActiveStep(0)
  }

  // API query for credit packages
  const { data: pkgData, isLoading: isPkgLoading } = useCreditPackageListQuery()
  const packages = pkgData?.data || []

  // Fallback packages if API returns empty/fails
  const fallbackPackages = [
    { _id: 'fallback-1', amount: 10000, points: 100, badge: '' },
    { _id: 'fallback-2', amount: 30000, points: 350, badge: '' },
    { _id: 'fallback-3', amount: 50000, points: 600, badge: '' },
    { _id: 'fallback-4', amount: 100000, points: 1200, badge: '' },
  ]

  const displayPackages = packages.length > 0 ? packages : fallbackPackages

  // Simulator Data for Interactive Section (Mimicking AttemptDetailTabs)
  const simulatorData = {
    grammar: {
      transcript: (
        <span className='text-sm leading-relaxed md:text-base'>
          I would like to talk about my favorite hobby. I{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-red-500/20 bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-600 dark:text-red-400'
            title='Sửa thành: enjoy listening'
          >
            enjoy to listen
          </span>{' '}
          to music because it helps me{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-red-500/20 bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-600 dark:text-red-400'
            title='Sửa thành: relax'
          >
            relaxing
          </span>{' '}
          after a long day. Sometimes I hear music while studying.
        </span>
      ),
      strengths: [
        'Sử dụng các cấu trúc câu ghép tương đối linh hoạt.',
        'Hầu hết các động từ chia đúng ở thì hiện tại đơn giản phù hợp cho phần thi.',
      ],
      limitations: [
        'Lỗi dùng sai dạng động từ sau "enjoy" (enjoy + V-ing): "enjoy to listen" -> "enjoy listening".',
        'Sai cấu trúc bổ ngữ sau "help someone do something": "helps me relaxing" -> "helps me relax / to relax".',
      ],
    },
    lexical: {
      transcript: (
        <span className='text-sm leading-relaxed md:text-base'>
          I would like to talk about my{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-amber-500/20 bg-amber-500/15 px-1.5 py-0.5 font-semibold text-amber-600 dark:text-amber-400'
            title='Gợi ý: beloved / preferred'
          >
            favorite
          </span>{' '}
          hobby. I enjoy to listen to music because it helps me relaxing after a
          long day. Sometimes I{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-red-500/20 bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-600 dark:text-red-400'
            title='Nên dùng: listen to'
          >
            hear
          </span>{' '}
          music while studying.
        </span>
      ),
      strengths: [
        'Vốn từ vựng tương đối đầy đủ để diễn đạt các ý tưởng về sở thích cá nhân.',
        'Sử dụng đúng và tự nhiên cụm collocations phổ biến như "long day".',
      ],
      limitations: [
        'Từ "favorite" được lặp đi lặp lại nhiều lần. Có thể nâng cấp lên "beloved" hoặc "preferred" để đạt band Lexical Resource 7.0+.',
        'Nhầm lẫn từ vựng: dùng "hear music" (nghe thụ động) thay vị cụm từ chính xác "listen to music" (chủ động lắng nghe).',
      ],
    },
    pronunciation: {
      transcript: (
        <span className='text-sm leading-relaxed md:text-base'>
          I would like to talk about my{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-red-500/20 bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-600 dark:text-red-400'
            title='IPA: /ˈfeɪ.vər.ɪt/'
          >
            favorite
          </span>{' '}
          hobby. I enjoy to listen to{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-red-500/20 bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-600 dark:text-red-400'
            title='IPA: /ˈmjuː.zɪk/'
          >
            music
          </span>{' '}
          because it helps me relaxing after a long day. Sometimes I hear music
          while studying.
        </span>
      ),
      strengths: [
        'Phát âm tương đối rõ ràng, các âm cuối (ending sounds) được giữ tương đối đầy đủ.',
        'Tông giọng tự nhiên và có nhịp điệu tương tác tốt.',
      ],
      limitations: [
        'Từ "favorite" phát âm chưa chuẩn nguyên âm (hay đọc thành 3 âm tiết rõ fa-vo-rite). IPA chuẩn là /ˈfeɪ.vər.ɪt/.',
        'Từ "music" chưa rung đúng âm hữu thanh /z/ ở giữa (đang phát âm nhầm thành âm vô thanh /s/).',
      ],
    },
    fluency: {
      transcript: (
        <span className='text-sm leading-relaxed md:text-base'>
          I would like to talk about my favorite hobby.{' '}
          <span
            className='mx-1 inline-flex cursor-help items-center gap-1 rounded border border-amber-500/20 bg-amber-500/15 px-1.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400'
            title='Khoảng ngắt nghỉ không tự nhiên'
          >
            {'[Tạm dừng 1.8s]'}
          </span>{' '}
          I enjoy to listen to music because it{' '}
          <span
            className='my-0.5 inline-block cursor-help rounded border border-red-500/20 bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-600 dark:text-red-400'
            title='Lặp cụm từ'
          >
            helps me... helps me
          </span>{' '}
          relaxing after a long day. Sometimes I hear music while studying.
        </span>
      ),
      strengths: [
        'Tốc độ nói trung bình ổn định, không quá chậm.',
        'Sử dụng ngữ điệu lên xuống tự nhiên ở cuối câu hỏi.',
      ],
      limitations: [
        'Xuất hiện khoảng dừng dài (1.8 giây) giữa các câu khi tìm ý làm ảnh hưởng độ trôi chảy.',
        'Bị lặp cụm từ tự sửa lỗi (helps me... helps me) làm gián đoạn độ lưu loát.',
      ],
    },
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className='bg-background text-foreground flex w-full flex-col overflow-x-hidden'>
      {/* 1. HERO SECTION (Nền: bg-background) */}
      <section className='bg-background relative overflow-hidden pt-6 pb-16 sm:pt-20 sm:pb-24'>
        <Container className='pt-0'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='grid grid-cols-1 items-center gap-12 lg:grid-cols-12'
          >
            {/* Left Content Column */}
            <div className='space-y-6 text-center lg:col-span-7 lg:text-left'>
              <motion.div
                variants={itemVariants}
                className='bg-accent text-foreground/80 border-border/60 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold'
              >
                <Sparkles className='h-3.5 w-3.5 fill-blue-500/20 text-blue-500' />
                <span>Giám Khảo AI</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className='text-foreground text-3xl leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-5xl'
              >
                {t('hero.title')}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className='text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed font-normal sm:text-lg lg:mx-0'
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className='flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start'
              >
                <Button
                  asChild
                  size='lg'
                  className='h-12 cursor-pointer rounded-xl px-6 text-sm font-bold shadow-sm'
                >
                  <Link href={route.forecast}>{t('hero.cta_practice')}</Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='border-border/80 hover:bg-accent h-12 cursor-pointer rounded-xl px-6 text-sm font-bold'
                >
                  <Link href={route.mockTest}>{t('hero.cta_mock')}</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Visual Column (Bản Mockup AI Grading cao cấp & độc lập) */}
            <motion.div
              variants={itemVariants}
              className='flex justify-center lg:col-span-5 lg:justify-end'
            >
              <div className='bg-card border-border/80 relative w-full max-w-[440px] space-y-5 overflow-hidden rounded-2xl border p-6 shadow-md'>
                {/* Header Mockup */}
                <div className='border-border/60 flex items-center justify-between border-b pb-4'>
                  <div className='flex items-center gap-2.5'>
                    <div className='bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg font-bold'>
                      AI
                    </div>
                    <div>
                      <div className='text-muted-foreground text-[10px] font-bold tracking-wider uppercase'>
                        Báo cáo chi tiết
                      </div>
                      <div className='text-foreground text-sm font-extrabold'>
                        Speprove AI Assessment
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-end'>
                    <div className='text-muted-foreground text-[10px] font-bold uppercase'>
                      Overall
                    </div>
                    <div className='flex items-baseline gap-0.5 text-emerald-600 dark:text-emerald-400'>
                      <span className='text-3xl leading-none font-black'>
                        7.5
                      </span>
                      <span className='text-xs font-semibold'>Band</span>
                    </div>
                  </div>
                </div>

                {/* Sub criteria scores */}
                <div className='space-y-3'>
                  {/* Progress 1 */}
                  <div>
                    <div className='mb-1 flex justify-between text-xs font-semibold'>
                      <span className='text-foreground/80'>
                        Trôi chảy & Mạch lạc (Fluency)
                      </span>
                      <span className='text-foreground'>7.0 / 9.0</span>
                    </div>
                    <div className='bg-accent h-2 w-full overflow-hidden rounded-full'>
                      <div
                        className='h-full rounded-full bg-emerald-500'
                        style={{ width: '77%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Progress 2 */}
                  <div>
                    <div className='mb-1 flex justify-between text-xs font-semibold'>
                      <span className='text-foreground/80'>
                        Phát âm chính xác (Pronunciation)
                      </span>
                      <span className='text-foreground'>8.0 / 9.0</span>
                    </div>
                    <div className='bg-accent h-2 w-full overflow-hidden rounded-full'>
                      <div
                        className='h-full rounded-full bg-emerald-500'
                        style={{ width: '88%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Progress 3 */}
                  <div>
                    <div className='mb-1 flex justify-between text-xs font-semibold'>
                      <span className='text-foreground/80'>
                        Vốn từ vựng (Lexical Resource)
                      </span>
                      <span className='text-foreground'>7.5 / 9.0</span>
                    </div>
                    <div className='bg-accent h-2 w-full overflow-hidden rounded-full'>
                      <div
                        className='h-full rounded-full bg-emerald-500'
                        style={{ width: '83%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Progress 4 */}
                  <div>
                    <div className='mb-1 flex justify-between text-xs font-semibold'>
                      <span className='text-foreground/80'>
                        Ngữ pháp đa dạng (Grammar)
                      </span>
                      <span className='text-foreground'>7.0 / 9.0</span>
                    </div>
                    <div className='bg-accent h-2 w-full overflow-hidden rounded-full'>
                      <div
                        className='h-full rounded-full bg-emerald-500'
                        style={{ width: '77%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Simulated Corrections List */}
                <div className='border-border/40 space-y-2.5 border-t pt-3'>
                  <div className='text-muted-foreground text-[10px] font-bold tracking-wider uppercase'>
                    Đánh giá chi tiết của AI
                  </div>

                  {/* Correction Item 1 */}
                  <div className='flex items-start gap-2.5 rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-700 dark:text-red-400'>
                    <AlertTriangle className='mt-0.5 h-4 w-4 flex-shrink-0 text-red-500' />
                    <div>
                      <p className='mb-0.5 font-bold'>Lỗi Ngữ pháp</p>
                      <p className='text-muted-foreground leading-normal'>
                        Bạn nói:{' '}
                        <span className='text-red-500/80 line-through'>
                          {'"he do not"'}
                        </span>{' '}
                        &rarr; Nên sửa:{' '}
                        <span className='text-foreground font-semibold dark:text-red-300'>
                          {'"he doesn\'t"'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Correction Item 2 */}
                  <div className='flex items-start gap-2.5 rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400'>
                    <Lightbulb className='mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500' />
                    <div>
                      <p className='mb-0.5 font-bold'>Gợi ý từ vựng 7.0+</p>
                      <p className='text-muted-foreground leading-normal'>
                        Thay vì:{' '}
                        <span className='text-amber-600/80 italic'>
                          {'"very hard"'}
                        </span>{' '}
                        &rarr; Nên dùng:{' '}
                        <span className='text-foreground font-semibold dark:text-amber-300'>
                          {'"laborious / arduous"'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* 2. STATS BAND (Nền: bg-card - xen kẽ màu nền) */}
      <section className='bg-card border-border/40 border-y py-10'>
        <Container>
          <div className='md:divide-border/60 grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:divide-x'>
            <div className='space-y-1'>
              <div className='text-foreground text-3xl font-extrabold tracking-tight'>
                50,000+
              </div>
              <div className='text-muted-foreground text-sm font-medium'>
                {t('stats.analyzed_answers')}
              </div>
            </div>
            <div className='space-y-1 md:px-4'>
              <div className='text-foreground text-3xl font-extrabold tracking-tight'>
                4 / 4
              </div>
              <div className='text-muted-foreground text-sm font-medium'>
                {t('stats.criteria')}
              </div>
            </div>
            <div className='space-y-1 md:px-4'>
              <div className='text-foreground text-3xl font-extrabold tracking-tight'>
                Live
              </div>
              <div className='text-muted-foreground text-sm font-medium'>
                {t('stats.forecast_sync')}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. FEATURE MATRIX (Nền: bg-background - xen kẽ màu nền) */}
      <section className='bg-background py-20 sm:py-24'>
        <Container>
          <div className='mx-auto mb-16 max-w-3xl space-y-3 text-center'>
            <h2 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
              {t('features.title')}
            </h2>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Giải pháp toàn diện giúp tối ưu điểm số IELTS Speaking trong thời
              gian ngắn nhất
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {/* Card 1: Forecast */}
            <div className='bg-card border-border/80 flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm'>
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-500'>
                <CalendarDays className='h-6 w-6' />
              </div>
              <h3 className='text-foreground mb-3.5 text-lg font-bold'>
                {t('features.forecast.title')}
              </h3>
              <p className='text-muted-foreground flex-grow text-sm leading-relaxed font-normal'>
                {t('features.forecast.desc')}
              </p>
            </div>

            {/* Card 2: Mock Test */}
            <div className='bg-card border-border/80 flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm'>
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-500'>
                <Mic className='h-6 w-6' />
              </div>
              <h3 className='text-foreground mb-3.5 text-lg font-bold'>
                {t('features.mock.title')}
              </h3>
              <p className='text-muted-foreground flex-grow text-sm leading-relaxed font-normal'>
                {t('features.mock.desc')}
              </p>
            </div>

            {/* Card 3: Diagnostic */}
            <div className='bg-card border-border/80 flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm'>
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 font-bold text-emerald-500'>
                <TrendingUp className='h-6 w-6' />
              </div>
              <h3 className='text-foreground mb-3.5 text-lg font-bold'>
                {t('features.diagnostic.title')}
              </h3>
              <p className='text-muted-foreground flex-grow text-sm leading-relaxed font-normal'>
                {t('features.diagnostic.desc')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. DYNAMIC INTERACTIVE SIMULATOR (Nền: bg-muted/40 - xen kẽ màu nền - Đồng bộ giao diện thật) */}
      <section className='bg-muted/40 border-border/40 border-b py-20 sm:py-24'>
        <Container>
          <div className='mx-auto mb-12 max-w-3xl space-y-3 text-center'>
            <h2 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
              Trải Nghiệm AI Chấm Điểm
            </h2>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Giao diện phân tích kết quả bài thi. Nhấp vào các tiêu chí để xem
              chi tiết.
            </p>
          </div>

          <div className='bg-card border-border/80 mx-auto max-w-4xl overflow-hidden rounded-2xl border shadow-sm'>
            <Tabs
              value={activeSim}
              onValueChange={(val) => setActiveSim(val as SimMode)}
            >
              <ScrollableTabsList
                variant='default'
                containerClassName='w-full border-b border-border/60 bg-muted/30 px-4 py-2'
              >
                {(
                  [
                    'fluency',
                    'pronunciation',
                    'lexical',
                    'grammar',
                  ] as SimMode[]
                ).map((tab) => {
                  const score =
                    tab === 'fluency'
                      ? 7.0
                      : tab === 'pronunciation'
                        ? 8.0
                        : tab === 'lexical'
                          ? 7.5
                          : 7.0
                  const scoreMeta = getBandScoreMeta(score)

                  return (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className='flex-1 cursor-pointer gap-1.5 px-3 py-1.5 text-sm font-medium'
                    >
                      {tab === 'fluency' && 'Trôi chảy & Mạch lạc'}
                      {tab === 'pronunciation' && 'Phát âm chính xác'}
                      {tab === 'lexical' && 'Vốn từ vựng'}
                      {tab === 'grammar' && 'Ngữ pháp đa dạng'}
                      <span
                        className={cn(
                          'text-sm font-bold transition-colors',
                          BAND_SCORE_TEXT_VARIANTS[scoreMeta.variant],
                        )}
                      >
                        {score.toFixed(1)}
                      </span>
                    </TabsTrigger>
                  )
                })}
              </ScrollableTabsList>

              <div className='bg-card space-y-6 p-4 md:p-6'>
                {/* 1. Transcript block */}
                <div>
                  <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                    <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
                      Bài nói (Transcript)
                    </p>
                    <div className='flex items-center gap-4 text-xs'>
                      <div className='flex items-center gap-1.5'>
                        <span className='h-2.5 w-2.5 rounded-full bg-amber-400 dark:bg-amber-500' />
                        <span className='text-muted-foreground'>
                          Lỗi nhẹ / Gợi ý
                        </span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <span className='h-2.5 w-2.5 rounded-full bg-red-400 dark:bg-red-500' />
                        <span className='text-muted-foreground'>Lỗi nặng</span>
                      </div>
                    </div>
                  </div>

                  <div className='text-foreground bg-muted/20 border-border/40 min-h-[100px] rounded-xl border p-4 text-sm leading-[1.8] sm:text-base'>
                    {simulatorData[activeSim].transcript}
                  </div>
                </div>

                {/* 2. Feedback block (Strengths & Limitations) */}
                <div className='border-border/40 space-y-4 border-t pt-6'>
                  <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
                    Nhận xét từ Giám khảo AI (Feedback)
                  </p>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Điểm tốt */}
                    <div className='space-y-3'>
                      <p className='flex items-center gap-1.5 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400'>
                        <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                        Điểm tốt (Strengths)
                      </p>
                      <ul className='text-foreground list-disc space-y-2.5 pl-5 text-xs leading-relaxed font-normal sm:text-sm'>
                        {simulatorData[activeSim].strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Điểm cần cải thiện */}
                    <div className='space-y-3'>
                      <p className='flex items-center gap-1.5 text-sm font-bold tracking-wide text-amber-600 dark:text-amber-400'>
                        <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
                        Điểm cần cải thiện (Limitations)
                      </p>
                      <ul className='text-foreground list-disc space-y-2.5 pl-5 text-xs leading-relaxed font-normal sm:text-sm'>
                        {simulatorData[activeSim].limitations.map(
                          (lim, idx) => (
                            <li key={idx}>{lim}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </Container>
      </section>

      {/* 5. HOW IT WORKS (Nền: bg-background - xen kẽ màu nền) */}
      <section className='bg-background py-20 sm:py-24'>
        <Container>
          <div className='mx-auto mb-12 max-w-3xl space-y-3 text-center'>
            <h2 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
              {t('how_it_works.title')}
            </h2>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Quy trình ôn luyện và đánh giá chuẩn hóa giúp bạn nâng band nhanh
              chóng
            </p>
          </div>

          {/* Switcher Tab */}
          <div className='mb-14 flex justify-center'>
            <div className='bg-accent border-border/80 inline-flex rounded-xl border p-1'>
              <button
                onClick={() => handleFlowChange('forecast')}
                className={`cursor-pointer rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                  activeFlow === 'forecast'
                    ? 'bg-card text-foreground border-border/50 border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('how_it_works.forecast_tab')}
              </button>
              <button
                onClick={() => handleFlowChange('mock')}
                className={`cursor-pointer rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                  activeFlow === 'mock'
                    ? 'bg-card text-foreground border-border/50 border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('how_it_works.mock_tab')}
              </button>
            </div>
          </div>

          {/* Stepper Interactive Section */}
          <div className='mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-10 lg:grid-cols-12'>
            {/* Steps list */}
            <div className='flex flex-col justify-center lg:col-span-6'>
              <div className='relative space-y-4 pl-4 sm:pl-6'>
                {/* Vertical connector line background */}
                <div className='bg-border/40 absolute top-6 bottom-6 left-[26px] w-0.5 sm:left-[30px]' />

                {/* Dynamic filled line showing progress */}
                <div
                  className='bg-primary/70 absolute top-6 left-[26px] w-0.5 transition-all duration-300 sm:left-[30px]'
                  style={{
                    height: `${(activeStep / (activeFlow === 'forecast' ? 3 : 2)) * 100}%`,
                    maxHeight: 'calc(100% - 48px)',
                  }}
                />

                {activeFlow === 'forecast' ? (
                  // Forecast Steps
                  <div className='space-y-4'>
                    {[
                      {
                        title: t('how_it_works.forecast.step1_title'),
                        desc: t('how_it_works.forecast.step1_desc'),
                        icon: Layers,
                      },
                      {
                        title: t('how_it_works.forecast.step2_title'),
                        desc: t('how_it_works.forecast.step2_desc'),
                        icon: Search,
                      },
                      {
                        title: t('how_it_works.forecast.step3_title'),
                        desc: t('how_it_works.forecast.step3_desc'),
                        icon: Mic,
                      },
                      {
                        title: t('how_it_works.forecast.step4_title'),
                        desc: t('how_it_works.forecast.step4_desc'),
                        icon: Award,
                      },
                    ].map((step, idx) => {
                      const StepIcon = step.icon
                      const isActive = activeStep === idx
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveStep(idx)}
                          className={`group relative z-10 flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4.5 text-left transition-all duration-200 ${
                            isActive
                              ? 'bg-card border-primary/40 ring-primary/5 shadow-sm ring-1'
                              : 'hover:bg-card/35 hover:border-border/30 border-transparent bg-transparent hover:translate-x-1'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 sm:h-10 sm:w-10 ${
                              isActive
                                ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 scale-105 shadow-sm'
                                : 'bg-card border-border text-muted-foreground group-hover:border-muted group-hover:text-foreground'
                            }`}
                          >
                            0{idx + 1}
                          </div>
                          <div className='flex-grow space-y-1 pt-0.5'>
                            <div className='flex items-center gap-1.5'>
                              <StepIcon
                                className={`h-4 w-4 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                              />
                              <h4
                                className={`text-sm font-bold transition-colors ${isActive ? 'text-primary' : 'text-foreground group-hover:text-foreground'}`}
                              >
                                {step.title}
                              </h4>
                            </div>
                            <p className='text-muted-foreground text-xs leading-relaxed font-normal'>
                              {step.desc}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  // Mock Test Steps
                  <div className='space-y-4'>
                    {[
                      {
                        title: t('how_it_works.mock.step1_title'),
                        desc: t('how_it_works.mock.step1_desc'),
                        icon: Layers,
                      },
                      {
                        title: t('how_it_works.mock.step2_title'),
                        desc: t('how_it_works.mock.step2_desc'),
                        icon: MessageSquare,
                      },
                      {
                        title: t('how_it_works.mock.step3_title'),
                        desc: t('how_it_works.mock.step3_desc'),
                        icon: Award,
                      },
                    ].map((step, idx) => {
                      const StepIcon = step.icon
                      const isActive = activeStep === idx
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveStep(idx)}
                          className={`group relative z-10 flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4.5 text-left transition-all duration-200 ${
                            isActive
                              ? 'bg-card border-primary/40 ring-primary/5 shadow-sm ring-1'
                              : 'hover:bg-card/35 hover:border-border/30 border-transparent bg-transparent hover:translate-x-1'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 sm:h-10 sm:w-10 ${
                              isActive
                                ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 scale-105 shadow-sm'
                                : 'bg-card border-border text-muted-foreground group-hover:border-muted group-hover:text-foreground'
                            }`}
                          >
                            0{idx + 1}
                          </div>
                          <div className='flex-grow space-y-1 pt-0.5'>
                            <div className='flex items-center gap-1.5'>
                              <StepIcon
                                className={`h-4 w-4 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                              />
                              <h4
                                className={`text-sm font-bold transition-colors ${isActive ? 'text-primary' : 'text-foreground group-hover:text-foreground'}`}
                              >
                                {step.title}
                              </h4>
                            </div>
                            <p className='text-muted-foreground text-xs leading-relaxed font-normal'>
                              {step.desc}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Stepper visual mockup display (Mock Web Browser Container) */}
            <div className='flex w-full justify-center lg:col-span-6 lg:justify-end'>
              <div className='bg-card border-border/80 relative flex w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border shadow-sm'>
                {/* Mock Browser Header */}
                <div className='bg-muted/40 border-border/60 flex items-center justify-between border-b px-4 py-3 select-none'>
                  <div className='flex items-center gap-1.5'>
                    <div className='h-2.5 w-2.5 rounded-full bg-red-400/80' />
                    <div className='h-2.5 w-2.5 rounded-full bg-amber-400/80' />
                    <div className='h-2.5 w-2.5 rounded-full bg-emerald-400/80' />
                  </div>
                  <span className='text-muted-foreground bg-background/50 border-border/40 rounded-md border px-3 py-0.5 font-mono text-[10px] font-medium'>
                    {activeFlow === 'forecast'
                      ? 'speprove.com/forecast'
                      : 'speprove.com/mock-test'}
                  </span>
                  <div className='w-12' /> {/* balance layout spacing spacer */}
                </div>

                {/* Mock Browser Page Content */}
                <div className='bg-card flex min-h-[300px] flex-grow items-center justify-center p-6'>
                  {activeFlow === 'forecast' ? (
                    // Forecast Steps Previews
                    <>
                      {activeStep === 0 && (
                        <div className='w-full space-y-4'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-xs font-bold tracking-wider uppercase'>
                            Bước 1: Chọn bộ đề & chủ đề
                          </div>
                          <div className='space-y-3'>
                            <div className='bg-muted/40 border-border/60 flex items-center justify-between rounded-xl border p-3'>
                              <div>
                                <div className='text-foreground text-xs font-bold'>
                                  Forecast Quý 3 & 4
                                </div>
                                <div className='text-muted-foreground text-[10px]'>
                                  54 chủ đề · Đang hoạt động
                                </div>
                              </div>
                              <span className='rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600'>
                                Đang chọn
                              </span>
                            </div>
                            <div className='grid grid-cols-2 gap-2 text-xs'>
                              <div className='bg-card border-primary flex h-20 flex-col justify-between rounded-xl border p-3 shadow-sm'>
                                <span className='text-foreground font-bold'>
                                  Technology
                                </span>
                                <span className='text-muted-foreground text-[10px]'>
                                  12 câu hỏi
                                </span>
                              </div>
                              <div className='bg-card border-border/80 flex h-20 flex-col justify-between rounded-xl border p-3 opacity-60'>
                                <span className='text-foreground font-bold'>
                                  Accommodation
                                </span>
                                <span className='text-muted-foreground text-[10px]'>
                                  8 câu hỏi
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <div className='w-full space-y-4'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-xs font-bold tracking-wider uppercase'>
                            Bước 2: Chọn câu hỏi luyện tập
                          </div>
                          <div className='space-y-2 text-xs'>
                            <div className='bg-card border-border/80 flex items-center justify-between rounded-xl border p-3 opacity-60'>
                              <span className='text-foreground font-medium'>
                                Q1: How often do you use computers?
                              </span>
                              <span className='text-muted-foreground text-[9px] font-bold'>
                                Part 1
                              </span>
                            </div>
                            <div className='bg-card border-primary flex items-center justify-between rounded-xl border p-3 shadow-sm'>
                              <span className='text-foreground font-bold'>
                                Q2: Do you think AI is useful?
                              </span>
                              <span className='bg-primary/10 text-primary rounded px-2 py-0.5 text-[9px] font-bold'>
                                Đang chọn
                              </span>
                            </div>
                            <div className='bg-card border-border/80 flex items-center justify-between rounded-xl border p-3 opacity-60'>
                              <span className='text-foreground font-medium'>
                                Q3: Will robots replace teachers?
                              </span>
                              <span className='text-muted-foreground text-[9px] font-bold'>
                                Part 3
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div className='w-full space-y-5 py-4 text-center'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-left text-xs font-bold tracking-wider uppercase'>
                            Bước 3: Thu âm trực tiếp bài nói
                          </div>
                          <div className='flex flex-col items-center justify-center space-y-4'>
                            <div className='relative flex items-center justify-center'>
                              <div className='absolute inset-0 animate-ping rounded-full bg-red-500/10' />
                              <div className='relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-md'>
                                <Mic className='h-6 w-6 animate-pulse' />
                              </div>
                            </div>
                            <div className='space-y-1'>
                              <div className='animate-pulse text-xs font-bold text-red-500'>
                                ĐANG THU ÂM...
                              </div>
                              <div className='text-muted-foreground font-mono text-[10px] font-medium'>
                                Thời gian: 00:38 / 02:00
                              </div>
                            </div>
                            <div className='flex h-8 w-full max-w-[200px] items-center justify-center gap-1.5'>
                              <span className='h-3 w-1 rounded-full bg-red-400' />
                              <span className='h-6 w-1 rounded-full bg-red-400' />
                              <span className='h-5 w-1 animate-bounce rounded-full bg-red-500' />
                              <span className='h-8 w-1 animate-bounce rounded-full bg-red-500 delay-75' />
                              <span className='h-4 w-1 animate-bounce rounded-full bg-red-500 delay-150' />
                              <span className='h-6 w-1 rounded-full bg-red-400' />
                              <span className='h-2 w-1 rounded-full bg-red-400' />
                            </div>
                          </div>
                        </div>
                      )}
                      {activeStep === 3 && (
                        <div className='w-full space-y-4'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-xs font-bold tracking-wider uppercase'>
                            Bước 4: Nhận đánh giá & sửa lỗi
                          </div>
                          <div className='space-y-3 text-xs'>
                            <div className='bg-muted/40 border-border/60 flex items-center justify-between rounded-xl border p-3 shadow-sm'>
                              <div className='flex items-center gap-2'>
                                <span className='text-foreground text-xs font-bold'>
                                  Điểm overall:
                                </span>
                                <span className='rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-sm font-extrabold text-emerald-600'>
                                  7.0 Band
                                </span>
                              </div>
                              <span className='text-muted-foreground text-[10px] font-medium'>
                                Speprove AI
                              </span>
                            </div>
                            <div className='bg-card border-border/80 space-y-2 rounded-xl border p-3 leading-relaxed'>
                              <div className='text-foreground/80 font-bold'>
                                Highlight sửa lỗi:
                              </div>
                              <p className='text-muted-foreground leading-normal'>
                                {'"... I enjoy '}
                                <span className='rounded bg-red-500/5 px-1 py-0.5 text-red-500 line-through'>
                                  to listen
                                </span>
                                {' to music..."'}
                              </p>
                              <p className='font-bold text-emerald-600 dark:text-emerald-400'>
                                &rarr; Sửa: {'"enjoy listening"'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Mock Test Steps Previews
                    <>
                      {activeStep === 0 && (
                        <div className='w-full space-y-4'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-xs font-bold tracking-wider uppercase'>
                            Bước 1: Chọn chế độ thi thử
                          </div>
                          <div className='space-y-2 text-xs'>
                            <div className='bg-card border-border/80 flex items-center justify-between rounded-xl border p-3 opacity-60'>
                              <span className='text-foreground font-bold'>
                                Part 1 Room
                              </span>
                              <span className='text-muted-foreground text-[10px]'>
                                1 Coin
                              </span>
                            </div>
                            <div className='bg-card border-primary flex items-center justify-between rounded-xl border p-3 shadow-sm'>
                              <div>
                                <div className='text-foreground flex items-center gap-1.5 font-bold'>
                                  Full Test Room
                                </div>
                                <div className='text-muted-foreground mt-0.5 text-[9px]'>
                                  Gồm 3 phần thi hoàn chỉnh
                                </div>
                              </div>
                              <span className='text-primary text-xs font-bold'>
                                5 Coins
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <div className='w-full space-y-4'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-xs font-bold tracking-wider uppercase'>
                            Bước 2: Giao tiếp với Giám khảo AI
                          </div>
                          <div className='bg-muted/40 border-border/60 space-y-4 rounded-xl border p-4 text-[11px]'>
                            <div className='flex items-start gap-3'>
                              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white'>
                                G
                              </div>
                              <div className='bg-card border-border/60 text-foreground rounded-2xl rounded-tl-none border p-3 leading-relaxed shadow-sm'>
                                <p className='text-primary mb-1 font-bold'>
                                  Examiner George
                                </p>
                                {
                                  "Let's talk about your hometown. Where is it located?"
                                }
                              </div>
                            </div>
                            <div className='text-muted-foreground flex animate-pulse items-center justify-center gap-1.5 pt-1.5 text-[10px] font-bold'>
                              <Volume2 className='text-primary h-3.5 w-3.5' />
                              Giám khảo AI đang đọc câu hỏi...
                            </div>
                          </div>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div className='w-full space-y-4'>
                          <div className='text-muted-foreground border-border/60 border-b pb-2 text-xs font-bold tracking-wider uppercase'>
                            Bước 3: Nhận kết quả đánh giá 4 tiêu chí
                          </div>
                          <div className='space-y-3.5'>
                            <div className='bg-card border-border/80 flex items-center justify-between rounded-xl border p-3 shadow-sm'>
                              <div>
                                <div className='text-muted-foreground text-[10px] font-bold uppercase'>
                                  Mock Test Result
                                </div>
                                <div className='text-foreground mt-0.5 text-sm font-extrabold'>
                                  {"George's Assessment"}
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-muted-foreground text-[9px] font-bold uppercase'>
                                  Overall Band
                                </div>
                                <span className='text-xl font-black text-emerald-600 dark:text-emerald-400'>
                                  7.5
                                </span>
                              </div>
                            </div>
                            <div className='grid grid-cols-4 gap-2 text-center text-[9px] font-bold'>
                              <div className='bg-muted/40 border-border/60 rounded border p-2'>
                                <div className='text-muted-foreground mb-0.5 text-[8px] uppercase'>
                                  Fluency
                                </div>
                                <div className='text-foreground'>7.0</div>
                              </div>
                              <div className='bg-muted/40 border-border/60 rounded border p-2'>
                                <div className='text-muted-foreground mb-0.5 text-[8px] uppercase'>
                                  Pronun
                                </div>
                                <div className='text-foreground'>8.0</div>
                              </div>
                              <div className='bg-muted/40 border-border/60 rounded border p-2'>
                                <div className='text-muted-foreground mb-0.5 text-[8px] uppercase'>
                                  Lexical
                                </div>
                                <div className='text-foreground'>7.5</div>
                              </div>
                              <div className='bg-muted/40 border-border/60 rounded border p-2'>
                                <div className='text-muted-foreground mb-0.5 text-[8px] uppercase'>
                                  Grammar
                                </div>
                                <div className='text-foreground'>7.0</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. PRICING PACKAGES (Nền: bg-card - xen kẽ màu nền) */}
      <section className='bg-card border-border/40 border-y py-20 sm:py-24'>
        <Container>
          <div className='mx-auto mb-16 max-w-3xl space-y-3 text-center'>
            <h2 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
              {t('pricing.title')}
            </h2>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Nạp điểm linh hoạt không lo đăng ký tháng dài hạn, chỉ trả cho số
              lượt làm bài thực tế
            </p>
          </div>

          {isPkgLoading ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='bg-background border-border/60 space-y-4 rounded-2xl border p-6 shadow-sm'
                >
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-10 w-32' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {displayPackages.map((pkg, idx) => {
                const isHighlighted =
                  pkg.amount === 50000 || (packages.length === 0 && idx === 2)
                return (
                  <div
                    key={pkg._id}
                    className={`bg-background relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 ${
                      isHighlighted
                        ? 'border-primary ring-primary/20 ring-1'
                        : 'border-border/80'
                    }`}
                  >
                    {/* Badge */}
                    {isHighlighted && (
                      <span className='bg-primary text-primary-foreground absolute -top-3 left-6 rounded-full border-0 px-3 py-1 text-[10px] font-bold uppercase shadow-sm'>
                        {pkg.badge || 'Được khuyên dùng'}
                      </span>
                    )}

                    <div className='flex-grow space-y-4'>
                      <div className='space-y-1.5'>
                        <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                          {idx === 0 && 'Starter'}
                          {idx === 1 && 'Basic'}
                          {idx === 2 && 'Standard'}
                          {idx === 3 && 'Intensive'}
                        </span>
                        <div className='text-foreground flex items-baseline gap-1'>
                          <span className='text-3xl font-black tracking-tight'>
                            {pkg.amount.toLocaleString('vi-VN')}
                          </span>
                          <span className='text-sm font-semibold'>VND</span>
                        </div>
                      </div>

                      {/* Point conversion */}
                      <div className='bg-accent/60 border-border/40 flex items-center gap-2 rounded-xl border p-2.5'>
                        <Image
                          src={logo}
                          alt='Points icon'
                          width={16}
                          height={16}
                        />
                        <span className='text-foreground text-sm font-bold'>
                          {t('pricing.points_short', {
                            points: pkg.points.toString(),
                          })}
                        </span>
                      </div>

                      <p className='text-muted-foreground text-xs leading-normal leading-relaxed font-normal'>
                        {idx === 0 && t('pricing.pkg1')}
                        {idx === 1 && t('pricing.pkg2')}
                        {idx === 2 && t('pricing.pkg3')}
                        {idx === 3 && t('pricing.pkg4')}
                        {idx >= 4 && 'Gói nạp ưu đãi cho thành viên.'}
                      </p>

                      {/* Value features */}
                      <ul className='border-border/40 space-y-2.5 border-t pt-4 text-xs'>
                        <li className='flex items-center gap-2'>
                          <Check className='h-4 w-4 flex-shrink-0 text-emerald-500' />
                          <span>Chấm điểm đầy đủ 4 tiêu chí</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <Check className='h-4 w-4 flex-shrink-0 text-emerald-500' />
                          <span>Chỉ lỗi ngữ pháp & từ vựng</span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      asChild
                      className='mt-6 h-11 w-full cursor-pointer rounded-xl text-xs font-bold'
                      variant={isHighlighted ? 'default' : 'outline'}
                    >
                      <Link href={route.payment}>Nạp tiền ngay</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 7. FAQ SECTION (Nền: bg-background - xen kẽ màu nền) */}
      <section className='bg-background py-20 sm:py-24'>
        <Container size='small'>
          <div className='mx-auto mb-14 max-w-3xl space-y-3 text-center'>
            <div className='bg-accent/80 border-border/60 text-foreground mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full border'>
              <HelpCircle className='h-5 w-5' />
            </div>
            <h2 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
              Giải đáp thắc mắc (FAQ)
            </h2>
            <p className='text-muted-foreground text-sm'>
              Những câu hỏi thường gặp về cách hoạt động của Speprove AI
            </p>
          </div>

          <Accordion type='single' collapsible className='w-full space-y-3.5'>
            <AccordionItem
              value='faq-1'
              className='bg-card border-border/80 rounded-2xl border px-5 py-1.5 shadow-sm'
            >
              <AccordionTrigger className='text-foreground text-sm font-bold hover:no-underline'>
                AI của Speprove chấm điểm có chính xác không?
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground pb-4 text-xs leading-relaxed font-normal'>
                Hệ thống AI của Speprove được tinh chỉnh và huấn luyện dựa trên
                hàng chục ngàn mẫu câu trả lời IELTS Speaking thực tế, bám sát
                bộ quy chuẩn chấm điểm chuẩn quốc tế từ IDP/British Council. Độ
                chính xác trung bình đạt khoảng +/- 0.5 band so với kết quả từ
                giám khảo thật.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='faq-2'
              className='bg-card border-border/80 rounded-2xl border px-5 py-1.5 shadow-sm'
            >
              <AccordionTrigger className='text-foreground text-sm font-bold hover:no-underline'>
                Điểm số (Coins) trong hệ thống được trừ như thế nào?
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground pb-4 text-xs leading-relaxed font-normal'>
                Điểm số chỉ bị trừ khi AI phân tích và trả về báo cáo kết quả
                thành công cho bạn. Mỗi câu trả lời Forecast đơn lẻ thường tiêu
                tốn 1 điểm, và một bài thi thử giả lập Full Test trọn gói 3 phần
                thi sẽ dao động từ 3 đến 5 điểm.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='faq-3'
              className='bg-card border-border/80 rounded-2xl border px-5 py-1.5 shadow-sm'
            >
              <AccordionTrigger className='text-foreground text-sm font-bold hover:no-underline'>
                Bộ đề thi Forecast được cập nhật với tần suất thế nào?
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground pb-4 text-xs leading-relaxed font-normal'>
                Bộ đề thi Forecast được cập nhật liên tục hàng tuần/hàng tháng
                dựa trên phản hồi thực tế từ các học viên đi thi thật về. Đảm
                bảo bạn luôn được ôn tập đúng trọng tâm các chủ đề nóng nhất
                đang được hỏi trong phòng thi thực tế.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='faq-4'
              className='bg-card border-border/80 rounded-2xl border px-5 py-1.5 shadow-sm'
            >
              <AccordionTrigger className='text-foreground text-sm font-bold hover:no-underline'>
                Tôi có thể sử dụng Speprove trên các thiết bị di động không?
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground pb-4 text-xs leading-relaxed font-normal'>
                Hoàn toàn có thể. Speprove được thiết kế tối ưu hóa hiển thị
                (Responsive) và hỗ trợ thu âm mượt mà ngay trên mọi trình duyệt
                di động (Safari trên iOS, Chrome/Samsung Internet trên Android)
                mà không cần cài đặt thêm bất kỳ ứng dụng bên thứ ba nào.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Container>
      </section>

      {/* 8. FINAL CTA (Nền: bg-foreground text-background - xen kẽ màu nền) */}
      <section className='bg-background relative overflow-hidden py-16 sm:py-24'>
        <Container>
          <div className='bg-foreground text-background relative flex flex-col items-center justify-center space-y-6 overflow-hidden rounded-3xl p-8 text-center shadow-md sm:p-16'>
            <div className='bg-background/10 text-background/80 border-background/10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase'>
              Bắt đầu hành trình nâng band ngay hôm nay
            </div>
            <h2 className='max-w-2xl text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl'>
              {t('final_cta.title')}
            </h2>
            <p className='text-background/70 max-w-lg text-sm leading-relaxed font-normal'>
              Chỉ mất 2 phút để bắt đầu và nhận phản hồi chi tiết về phát âm,
              ngữ pháp và từ vựng từ Giám khảo AI.
            </p>
            <Button
              asChild
              size='lg'
              variant='secondary'
              className='bg-background text-foreground hover:bg-background/90 mt-2 h-12 cursor-pointer rounded-xl px-8 text-sm font-bold shadow-sm'
            >
              <Link href={route.forecast} className='flex items-center gap-1.5'>
                <span>{t('final_cta.btn')}</span>
                <ChevronRight className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
