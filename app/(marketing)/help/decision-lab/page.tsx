import { FlaskConical } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Decision Lab — Help Center — RefZone' }

export default function DecisionLabHelpPage() {
  return (
    <HelpArticleLayout
      icon={FlaskConical}
      title="Decision Lab"
      description="AI-powered match scenario analysis tool."
    >
      <HelpSection title="What is Decision Lab?">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Decision Lab is RefZone&apos;s interactive analysis tool. Describe any match situation — real or hypothetical — and get an instant, detailed breakdown of the correct decision based on the IFAB Laws of the Game 2025/26.
        </p>
        <HelpTip>
          Think of it as having an experienced referee mentor available 24/7. Decision Lab is currently in beta.
        </HelpTip>
      </HelpSection>

      <HelpSection title="How to use it">
        <HelpList items={[
          'Navigate to Decision Lab from the dashboard or bottom navigation.',
          'Type a match scenario in the text box — be as descriptive as possible.',
          'Include details like: where on the pitch, what the players did, what contact was made, and the outcome.',
          'Press Enter or click the send button to submit.',
          'The AI analyses your scenario and responds with the correct decision, the applicable Law, and a detailed explanation.',
          'You can ask follow-up questions in the same conversation.',
          'Click "New Scenario" to start a fresh analysis.',
        ]} />
      </HelpSection>

      <HelpSection title="Example prompts">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          Here are some examples of good prompts:
        </p>
        <HelpList items={[
          '"A defender slides in from behind and makes contact with the attacker\'s ankle before touching the ball, just outside the penalty area."',
          '"An attacker handles the ball before scoring a goal. The referee did not see it but the VAR did. What happens?"',
          '"A goalkeeper picks up a deliberate back pass from a teammate. What is the correct decision?"',
          '"A player is in an offside position but does not touch the ball. However, they distract the goalkeeper. Is this offside?"',
          '"Two players from the same team commit fouls simultaneously against different opponents. How does the referee handle this?"',
        ]} />
      </HelpSection>

      <HelpSection title="Understanding responses">
        <HelpList items={[
          'Law references (e.g. "Law 12.2") are highlighted in purple for easy identification.',
          'Summary verdicts and key decisions are highlighted in green.',
          'Bullet points break down complex situations step by step.',
          'Bold text highlights critical points in the analysis.',
          'A disclaimer appears below each response reminding you that the analysis is AI-generated and should be verified.',
        ]} />
      </HelpSection>

      <HelpSection title="Tips for better results">
        <HelpList items={[
          'Be specific — "a player fouls another" gives worse results than describing exactly what happened.',
          'Include the location on the pitch — inside or outside the penalty area matters for many decisions.',
          'Mention the phase of play — open play, set piece, restart, etc.',
          'Ask about edge cases — Decision Lab handles unusual situations well.',
          'If the first response is unclear, ask a follow-up question for clarification.',
        ]} />
        <HelpTip>
          Decision Lab does not track accuracy or contribute to your law-by-law breakdown. It is a learning tool, not an assessment tool. For tracked practice, use Quizzes or Scenarios.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Limitations">
        <HelpList items={[
          'Decision Lab is in beta and may occasionally produce incorrect or incomplete analyses.',
          'Response time varies from 5 to 15 seconds depending on complexity.',
          'The AI is trained on the IFAB Laws of the Game but may not cover every edge case perfectly.',
          'Always verify decisions against the official Laws of the Game before applying them in real matches.',
          'If the service is unavailable, try again in a few minutes.',
        ]} />
      </HelpSection>
    </HelpArticleLayout>
  )
}
