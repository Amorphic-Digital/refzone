import { Target } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Scenarios — Help Center — RefZone', description: 'How to use RefZone match scenarios: make your call, get expert analysis, track your streak, and improve your referee decision-making skills.' }

export default function ScenariosHelpPage() {
  return (
    <HelpArticleLayout
      icon={Target}
      title="Scenarios"
      description="Video-based match scenarios where you make the call."
    >
      <HelpSection title="How scenarios work">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Each scenario presents a real match situation as a video clip. Your job is to watch it and decide what the correct call should be — just like you would on the pitch.
        </p>
        <HelpList items={[
          'Videos autoplay muted when the page loads and play through once.',
          'You can pause and restart the clip, and drag along the timeline to rewatch any moment.',
          'The player has no other controls — no speed, volume or fullscreen — so the focus stays on the decision.',
          'A timer tracks how long you take to make your decision.',
        ]} />
      </HelpSection>

      <HelpSection title="Submitting your decision">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Type your decision in the text box below the video. Be as specific as possible.
        </p>
        <HelpList items={[
          'Include the call: direct free kick, indirect free kick, penalty kick, no foul, etc.',
          'Include any disciplinary action: yellow card, red card, or no card.',
          'Mention the restart and location if relevant.',
          'Example: "Direct free kick to the defending team. Yellow card for reckless challenge. Law 12."',
        ]} />
        <HelpTip>
          The AI compares your answer semantically to the correct decision. You do not need to match the exact wording — just get the key elements right. You need a 70% confidence score or higher to be marked correct.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Scenario streaks">
        <HelpList items={[
          'Your scenario streak counts consecutive correct decisions.',
          'If you get one wrong, the streak resets to zero.',
          'Your best scenario streak is always saved.',
          'The streak is separate from your daily activity streak.',
        ]} />
      </HelpSection>

      <HelpSection title="How scenarios are selected">
        <HelpList items={[
          'Scenarios are shown in random order using a shuffle algorithm.',
          'Once you complete a scenario, it will not appear again until you have completed all available scenarios.',
          'Each scenario is tagged with a law category (e.g. Law 12), scenario type (foul, offside, handball, etc.), and difficulty level.',
          'Completed scenarios contribute to your law-by-law accuracy breakdown on the dashboard.',
          'When all scenarios are completed, you can generate a new AI-created scenario.',
        ]} />
      </HelpSection>

      <HelpSection title="Points and scoring">
        <HelpList items={[
          'Each correct scenario earns you 10 points.',
          'Incorrect scenarios earn 0 points.',
          'Points contribute to your total score and leaderboard position.',
          'Your time taken is recorded but does not affect scoring.',
        ]} />
      </HelpSection>
    </HelpArticleLayout>
  )
}
