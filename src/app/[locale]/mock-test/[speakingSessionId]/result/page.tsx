import Container from '@/components/layout/container'
import MockTestResult from './_components/mock-test-result'

interface PageProps {
  params: Promise<{
    speakingSessionId: string
    locale: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { speakingSessionId } = await params

  return (
    <Container size='small'>
      <MockTestResult speakingSessionId={speakingSessionId} />
    </Container>
  )
}
