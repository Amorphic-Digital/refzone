import type { Metadata } from 'next'
import { WeeklyQuizClient } from './weekly-quiz-client'

export const metadata: Metadata = {
  title: 'Free Weekly Football Referee Quiz — Laws of the Game',
  description:
    'Test your Laws of the Game knowledge with RefZone\'s free weekly quiz. 15 new questions every week, instant results, no sign-up required. For Australian referees.',
}

export default function WeeklyQuizPage() {
  return <WeeklyQuizClient />
}
