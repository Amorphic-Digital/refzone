import { Zap } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpStep, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Getting Started — Help Center — RefZone' }

export default function GettingStartedPage() {
  return (
    <HelpArticleLayout
      icon={Zap}
      title="Getting Started"
      description="Set up your account and start training in under a minute."
    >
      <HelpSection title="Creating your account">
        <HelpStep number={1} title="Visit the sign-up page">
          Go to <strong>refzone.com.au</strong> and click <strong>"Start training free"</strong> or navigate directly to the sign-up page. You can sign up with your email address or use Google for one-click access.
        </HelpStep>
        <HelpStep number={2} title="Choose a display name">
          After signing up, you will be asked to set a display name. This is how other users see you on the leaderboard. Display names must be unique.
        </HelpStep>
        <HelpStep number={3} title="Explore your dashboard">
          Once signed in, you land on your dashboard. This is your home base — it shows your streaks, accuracy stats, recommended quizzes, and quick links to all features.
        </HelpStep>
        <HelpTip>
          You do not need a credit card to sign up. All core training features are free.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Your first scenario">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Scenarios are video-based match situations where you make the call. Navigate to <strong>Scenarios</strong> from the dashboard or bottom navigation.
        </p>
        <HelpList items={[
          'A match clip will autoplay — first at normal speed, then at 0.5x slow motion, on a loop.',
          'Watch carefully and type your decision in the text box below the video.',
          'Be specific: include the call (e.g. "Direct free kick"), any cards, and the restart.',
          'Click "Submit Decision" and the AI will compare your answer to the correct decision.',
          'You need 70% confidence or higher to be marked correct.',
        ]} />
      </HelpSection>

      <HelpSection title="Your first quiz">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Quizzes test your Laws of the Game knowledge with multiple choice, true/false, and multi-select questions.
        </p>
        <HelpList items={[
          'Go to Quizzes from the dashboard and pick any quiz.',
          'Quizzes come in Short (5 questions), Standard (10), and Long (15) formats.',
          'Answer each question and click "Next" to proceed.',
          'After submitting, you see your score, a breakdown of each question, and the correct answers with explanations.',
          'Your results are saved automatically and feed into your law-by-law performance breakdown.',
        ]} />
      </HelpSection>

      <HelpSection title="Understanding your dashboard">
        <HelpList items={[
          'Daily streak — consecutive days you have completed at least one quiz or scenario.',
          'Scenario streak — consecutive correct scenario decisions.',
          'Activity chart — shows your questions answered and accuracy over the last 7 days.',
          'Law-by-law breakdown — your accuracy percentage for each of the 17 Laws of the Game.',
          'Recommendations — weak areas to practice and strong areas to maintain.',
        ]} />
        <HelpTip>
          The dashboard updates automatically as you complete quizzes and scenarios. No manual refresh needed.
        </HelpTip>
      </HelpSection>
    </HelpArticleLayout>
  )
}
