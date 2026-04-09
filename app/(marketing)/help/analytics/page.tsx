import { BarChart3 } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Performance Analytics — Help Center — RefZone', description: 'How to read your RefZone analytics dashboard: accuracy metrics, law-by-law breakdown, 7-day activity tracker, and difficulty-level performance.' }

export default function AnalyticsHelpPage() {
  return (
    <HelpArticleLayout
      icon={BarChart3}
      title="Performance Analytics"
      description="Track your progress across every Law of the Game."
    >
      <HelpSection title="Dashboard overview">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Your dashboard is the central hub for all your training data. It updates automatically as you complete quizzes and scenarios.
        </p>
        <HelpList items={[
          'Welcome banner with your display name.',
          'Quick-access cards for Scenarios, Quizzes, and Decision Lab.',
          'Daily streak counter showing consecutive active days.',
          'Best streak — your highest ever consecutive days.',
          'Last 7 days activity calendar showing active and inactive days.',
        ]} />
      </HelpSection>

      <HelpSection title="Activity chart">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          The 7-day activity chart shows three data series:
        </p>
        <HelpList items={[
          'Purple bars — total questions answered each day (from both quizzes and scenarios).',
          'Pink bars — number of correct answers each day.',
          'Yellow line — accuracy percentage trend over the week (right Y-axis, 0-100%).',
          'Hover over any day to see the exact numbers in a tooltip.',
          'The total questions count for the week is shown in the top right.',
        ]} />
        <HelpTip>
          If no activity appears, complete a quiz or scenario and the chart will populate immediately on your next dashboard visit.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Law-by-law breakdown">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          This section shows your accuracy percentage for each of the 17 Laws of the Game.
        </p>
        <HelpList items={[
          'A gradient bar visualises your accuracy from 0% to 100%.',
          'Laws you have not yet been tested on show "N/A".',
          'Sort by "In order" (Law 1 through Law 17) or "By accuracy" (weakest first).',
          'Click "Practice" next to any law to find quizzes focused on that area.',
          'Both quiz results and scenario results feed into the breakdown.',
          'The breakdown uses weighted averages when you have multiple attempts across different sections of the same law.',
        ]} />
      </HelpSection>

      <HelpSection title="Recommendations">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          The recommendations section identifies areas you should focus on.
        </p>
        <HelpList items={[
          'Weak areas — laws where your accuracy is below average, shown in red/amber.',
          'Strong areas — laws where your accuracy is high, shown in green.',
          'Each recommendation includes the law category, section, and your current accuracy.',
          'You can generate a targeted practice quiz directly from a weak area recommendation.',
          'Recommendations update as you complete more quizzes and scenarios.',
        ]} />
      </HelpSection>

      <HelpSection title="Performance stats">
        <HelpList items={[
          'Scenario accuracy — your overall correct rate across all scenarios.',
          'Quiz accuracy — your overall correct rate across all quiz attempts.',
          'Total scenarios — the number of scenarios you have completed.',
          'Total quizzes — the number of quiz attempts you have made.',
        ]} />
      </HelpSection>

      <HelpSection title="How data is calculated">
        <HelpList items={[
          'Quiz accuracy is calculated from your total score divided by total possible points across all attempts.',
          'Scenario accuracy is calculated from correct scenarios divided by total scenarios attempted.',
          'Law breakdown accuracy uses per-question data when available, or distributes scores proportionally across laws covered in each quiz.',
          'Streaks are based on UTC calendar days — a day of activity means at least one quiz or scenario completed.',
          'All data is stored server-side and syncs across all your devices.',
        ]} />
      </HelpSection>
    </HelpArticleLayout>
  )
}
