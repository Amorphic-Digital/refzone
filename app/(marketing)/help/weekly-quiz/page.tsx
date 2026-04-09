import { Users } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Weekly Quiz — Help Center — RefZone' }

export default function WeeklyQuizHelpPage() {
  return (
    <HelpArticleLayout
      icon={Users}
      title="Weekly Quiz"
      description="A free public quiz every week — no sign-up required."
    >
      <HelpSection title="What is the Weekly Quiz?">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Every week, RefZone publishes a new Weekly Challenge quiz with 15 questions covering a broad range of Laws of the Game. The quiz is completely free and does not require an account to play.
        </p>
        <HelpTip>
          The Weekly Quiz is a great way to try RefZone before committing to an account. If you like it, sign up to save your results and track your progress over time.
        </HelpTip>
      </HelpSection>

      <HelpSection title="How it works">
        <HelpList items={[
          'Visit refzone.com.au/weekly-quiz to access the current week\'s quiz.',
          'The quiz has 15 questions across multiple choice, true/false, and multi-select formats.',
          'You have 20 minutes to complete the quiz (a timer tracks your time).',
          'Navigate between questions freely before submitting.',
          'After submission, you see your score, an accuracy ring, and a full question-by-question review.',
          'Each question includes the correct answer and a detailed explanation citing the relevant Law.',
        ]} />
      </HelpSection>

      <HelpSection title="Saving your results">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          When you complete the Weekly Quiz without being signed in, your results are saved locally in your browser.
        </p>
        <HelpList items={[
          'After completing the quiz, you will see a prompt to create an account or sign in.',
          'If you sign up or log in within 24 hours of completing the quiz, your results are automatically submitted to your profile.',
          'This happens automatically when you visit your dashboard — no extra steps needed.',
          'Results saved locally expire after 24 hours.',
          'Make sure you do not clear your browser data before signing in, or your results will be lost.',
        ]} />
        <HelpTip>
          If you already have an account, sign in before taking the Weekly Quiz and your results will be saved immediately.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Weekly Quiz vs regular quizzes">
        <HelpList items={[
          'The Weekly Quiz is public — anyone can access it without an account.',
          'Regular quizzes require a free RefZone account.',
          'The Weekly Quiz is always 15 questions; regular quizzes vary in length.',
          'The Weekly Quiz changes every week; regular quizzes are always available.',
          'Both types contribute equally to your stats if you are signed in.',
          'A new Weekly Quiz is published automatically each week.',
        ]} />
      </HelpSection>
    </HelpArticleLayout>
  )
}
