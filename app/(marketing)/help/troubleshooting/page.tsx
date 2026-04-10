import { Shield } from 'lucide-react'
import Link from 'next/link'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Troubleshooting — Help Center — RefZone', description: 'Fix common RefZone issues: login problems, quiz loading errors, streak resets, browser compatibility, and how to contact support.' }

export default function TroubleshootingHelpPage() {
  return (
    <HelpArticleLayout
      icon={Shield}
      title="Troubleshooting"
      description="Common issues and step-by-step solutions."
    >
      <HelpSection title="I can't log in to my account">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          If you are having trouble signing in, try these steps in order:
        </p>
        <HelpList items={[
          'Make sure you are using the correct sign-in method. If you signed up with Google, click the Google button — do not enter an email and password.',
          'If you signed up with email/password, click "Forgot password?" on the login page to reset it.',
          'Check that you are entering the exact email address you used to sign up.',
          'Clear your browser cookies for refzone.com.au and try again.',
          'Try a different browser or incognito/private window.',
          'If none of these work, email support@refzone.com.au with the email address you signed up with.',
        ]} />
      </HelpSection>

      <HelpSection title="My quiz results didn't save">
        <HelpList items={[
          'Quiz results are saved automatically when you click "Submit Quiz" while signed in.',
          'If you see your results after submitting, they were saved successfully.',
          'If you took the Weekly Quiz without being signed in, your results are saved in your browser.',
          'Sign in within 24 hours and visit your dashboard — results are submitted automatically.',
          'Do not clear your browser data before signing in, or locally saved results will be lost.',
          'If results are still missing after signing in, try taking another quiz to verify saving works.',
        ]} />
        <HelpTip>
          For the most reliable experience, always sign in before starting a quiz. This ensures results are saved immediately.
        </HelpTip>
      </HelpSection>

      <HelpSection title="The scenario video isn't playing">
        <HelpList items={[
          'Scenario videos use YouTube embeds and autoplay muted.',
          'Most browsers allow muted autoplay by default. If the video does not start, refresh the page.',
          'Check your internet connection — YouTube needs to be accessible for videos to load.',
          'If you are on a corporate, school, or public network, YouTube may be blocked by the network administrator.',
          'Try accessing the page on a different network (e.g. mobile data) to confirm.',
          'Some browser extensions (ad blockers, privacy tools) can block YouTube embeds. Try disabling them temporarily.',
          'If the video shows but has no picture, your browser may not support the video codec. Try Chrome or Firefox.',
        ]} />
      </HelpSection>

      <HelpSection title="My streak reset unexpectedly">
        <HelpList items={[
          'Daily streaks require at least one completed quiz or scenario per calendar day.',
          'Streaks are tracked in UTC (Coordinated Universal Time), not your local timezone.',
          'In Australia, UTC is 10-11 hours behind AEST/AEDT. Training at 11pm AEST on Monday counts as Monday UTC.',
          'If you trained late at night, it is possible the activity was recorded on the next UTC day, creating a gap.',
          'To be safe, complete your daily activity during daytime hours.',
          'Your "Best" streak is always preserved and never resets — only the current streak resets.',
          'Decision Lab sessions do not count as daily activity. You must complete a quiz or scenario.',
        ]} />
      </HelpSection>

      <HelpSection title="Decision Lab isn't responding">
        <HelpList items={[
          'Decision Lab uses AI to analyse scenarios, which typically takes 5-15 seconds.',
          'If the loading spinner runs for more than 30 seconds, refresh the page and try again.',
          'Very complex or unusual scenarios may take longer to process.',
          'The AI service may occasionally be unavailable due to maintenance or high demand.',
          'Try simplifying your scenario description if it is very long.',
          'Decision Lab is in beta — if it consistently fails, please report it via the Contact page.',
        ]} />
      </HelpSection>

      <HelpSection title="My law-by-law breakdown shows N/A">
        <HelpList items={[
          'The breakdown only shows accuracy for laws where you have completed at least one quiz question or scenario tagged with that law.',
          'Decision Lab conversations do not contribute to the breakdown.',
          'If you completed a quiz but a specific law still shows N/A, the quiz may not have included questions tagged with that law.',
          'Use the "Practice" button next to the N/A law to find quizzes that cover it.',
          'Scenario completions also feed into the breakdown — completing a scenario tagged with a specific law will update it.',
        ]} />
      </HelpSection>

      <HelpSection title="The page isn't loading or shows an error">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          If you see a white screen, error message, or "Application error" page, try these steps:
        </p>
        <HelpList items={[
          'Refresh the page (Ctrl+R or Cmd+R).',
          'Clear your browser cache and cookies for refzone.com.au.',
          'Try a different browser (Chrome, Firefox, Safari, Edge).',
          'Check if the issue happens on both mobile and desktop.',
          'Try accessing the page in an incognito/private window.',
          'Check your internet connection and try again.',
          'If the error persists, it may be a server-side issue. Wait a few minutes and try again.',
          'If still broken, email support@refzone.com.au with a screenshot of the error, the URL, and what device/browser you are using.',
        ]} />
      </HelpSection>

      <HelpSection title="I want to report a bug or give feedback">
        <HelpList items={[
          'Use the "Feedback" button that appears on scenario and quiz pages to report issues with specific content.',
          'For general bugs or feature requests, use the Contact page.',
          'Include as much detail as possible: what you were doing, what you expected, and what actually happened.',
          'Screenshots are very helpful for bug reports.',
        ]} />
        <div className="mt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            Go to Contact page
          </Link>
        </div>
      </HelpSection>
    </HelpArticleLayout>
  )
}
