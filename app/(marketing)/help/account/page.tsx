import { Users } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Account & Settings — Help Center — RefZone', description: 'Manage your RefZone account: update your profile, change display name, adjust notification preferences, and manage your referee training settings.' }

export default function AccountHelpPage() {
  return (
    <HelpArticleLayout
      icon={Users}
      title="Account & Settings"
      description="Managing your profile, display name, and account settings."
    >
      <HelpSection title="Your profile">
        <HelpList items={[
          'Your profile stores your display name, total points, streaks, and training history.',
          'Other users can see your display name and total points on the leaderboard.',
          'Your detailed performance data (accuracy by law, quiz history) is private to you.',
          'Profile data syncs across all devices — sign in anywhere and your progress is there.',
        ]} />
      </HelpSection>

      <HelpSection title="Changing your display name">
        <HelpList items={[
          'Go to Settings from the bottom navigation menu (tap "More" → "Settings").',
          'Your display name is shown at the top of the settings page.',
          'Edit the name and save. Display names must be unique across all users.',
          'If the name is already taken, you will see an error — try a different name.',
          'Your display name appears on the leaderboard and in your profile.',
        ]} />
      </HelpSection>

      <HelpSection title="Email and password">
        <HelpList items={[
          'Your email address is managed through your authentication provider.',
          'If you signed up with email/password, you can reset your password from the login page.',
          'If you signed up with Google, your email is tied to your Google account and cannot be changed within RefZone.',
          'To reset your password, go to the login page and click "Forgot password?". A reset link will be sent to your email.',
        ]} />
      </HelpSection>

      <HelpSection title="Using multiple devices">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          RefZone is a web application that works on any device with a modern browser.
        </p>
        <HelpList items={[
          'Simply visit refzone.com.au and sign in on any device.',
          'All your data — streaks, quiz results, scenario completions — syncs automatically.',
          'There is no native mobile app. The web app is fully responsive and works like an app on mobile.',
          'You can add RefZone to your home screen on iOS or Android for quick access.',
          'On iOS: open Safari → tap Share → "Add to Home Screen".',
          'On Android: open Chrome → tap the three-dot menu → "Add to Home Screen".',
        ]} />
      </HelpSection>

      <HelpSection title="Notifications">
        <HelpList items={[
          'RefZone may send in-app notifications about new features, weekly quizzes, or important updates.',
          'Notifications appear as a bell icon in the top navigation.',
          'You can dismiss notifications by clicking on them.',
          'We do not send push notifications or SMS messages.',
        ]} />
      </HelpSection>

      <HelpSection title="Deleting your account">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          You can permanently delete your account and all associated data from the Settings page.
        </p>
        <HelpList items={[
          'Go to Settings and scroll to the bottom.',
          'Click "Delete Account" and confirm.',
          'This permanently removes your profile, all quiz attempts, scenario responses, streaks, law performance data, and activity logs.',
          'This action cannot be undone.',
          'If you have trouble deleting your account, email support@refzone.com.au.',
        ]} />
        <HelpTip>
          Consider exporting or reviewing your performance data before deleting. Once deleted, we cannot recover any of your training history.
        </HelpTip>
      </HelpSection>
    </HelpArticleLayout>
  )
}
