import { Trophy } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Streaks & Points — Help Center — RefZone', description: 'How streaks and points work on RefZone: daily training streaks, activity calendar, personal bests, and how consistency builds better referee skills.' }

export default function StreaksHelpPage() {
  return (
    <HelpArticleLayout
      icon={Trophy}
      title="Streaks & Points"
      description="Stay motivated with daily streaks, points, and the leaderboard."
    >
      <HelpSection title="Daily streaks">
        <HelpList items={[
          'Your daily streak counts consecutive calendar days where you completed at least one quiz or scenario.',
          'Complete any training activity to keep your streak alive for the day.',
          'If you miss a day entirely, your streak resets to 1 the next time you train.',
          'Your "Best" streak (longest ever) is always saved and never resets.',
          'The streak calendar on your dashboard shows the last 7 days with active days marked by a flame icon.',
          'Today is always highlighted with a purple dot.',
        ]} />
        <HelpTip>
          Streaks are tracked in UTC. Depending on your timezone, the day boundary may not align exactly with your local midnight. To be safe, train at least once during your daytime hours.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Scenario streaks">
        <HelpList items={[
          'Scenario streaks are separate from daily streaks.',
          'They count consecutive correct scenario decisions.',
          'Getting a scenario wrong resets the scenario streak to zero.',
          'Your best scenario streak is saved on your profile.',
          'The scenario streak is displayed in the scenario player and on your dashboard.',
        ]} />
      </HelpSection>

      <HelpSection title="Points system">
        <HelpList items={[
          'Earn points for every correct answer across quizzes and scenarios.',
          'Quiz questions are worth 5 or 10 points each, depending on difficulty.',
          'Each correct scenario is worth 10 points.',
          'Incorrect answers earn 0 points.',
          'Your total points accumulate over time and never decrease.',
          'Points are displayed on your profile and contribute to the leaderboard.',
        ]} />
      </HelpSection>

      <HelpSection title="Leaderboard">
        <HelpList items={[
          'The leaderboard ranks all RefZone users by total points.',
          'Your position updates in real time as you earn points.',
          'The leaderboard is accessible from the main navigation.',
          'Display names are shown — make sure yours is set in Settings.',
          'The leaderboard is public and visible to all signed-in users.',
        ]} />
      </HelpSection>

      <HelpSection title="Tips for maintaining streaks">
        <HelpList items={[
          'Set a daily reminder to complete at least one quiz or scenario.',
          'Even a 5-question short quiz counts as a full day of activity.',
          'Try to train at the same time each day to build a habit.',
          'Use the dashboard recommendations to quickly find something to practice.',
          'Consistency matters more than volume — one quiz per day builds a strong streak.',
        ]} />
      </HelpSection>
    </HelpArticleLayout>
  )
}
