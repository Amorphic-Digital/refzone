import { BookOpen } from 'lucide-react'
import { HelpArticleLayout, HelpSection, HelpTip, HelpList } from '@/components/marketing/help-article-layout'

export const metadata = { title: 'Quizzes — Help Center — RefZone', description: 'How to use RefZone quizzes: browse by law, filter by difficulty, track your accuracy, and understand instant feedback on every question.' }

export default function QuizzesHelpPage() {
  return (
    <HelpArticleLayout
      icon={BookOpen}
      title="Quizzes"
      description="Test your Laws of the Game knowledge with 500+ questions."
    >
      <HelpSection title="Quiz formats">
        <HelpList items={[
          'Short quizzes — 5 questions, 10 minute time limit.',
          'Standard quizzes — 10 questions, 15 minute time limit.',
          'Long quizzes — 15 questions, 20 minute time limit.',
          'Question types include multiple choice, true/false, and multi-select.',
          'Multi-select questions require you to select all correct answers.',
        ]} />
      </HelpSection>

      <HelpSection title="Finding quizzes">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          The Quizzes page shows all available quizzes. You can filter and search to find exactly what you need.
        </p>
        <HelpList items={[
          'Search by topic, law number, or keyword (e.g. "offside", "Law 12", "handball").',
          'Filter by law category to focus on a specific area.',
          'Filter by difficulty: easy, medium, or hard.',
          'Filter by length: short, standard, or long.',
          'Completed quizzes are hidden by default — toggle "Show completed" to retake them.',
          'The total quiz count and completed count are shown at the top of the page.',
        ]} />
        <HelpTip>
          Your dashboard recommends quizzes based on your weakest law categories. Click "Practice" next to any law in the breakdown to find relevant quizzes.
        </HelpTip>
      </HelpSection>

      <HelpSection title="Taking a quiz">
        <HelpList items={[
          'Click "Start Quiz" on any quiz card to begin.',
          'A timer starts counting from the moment you begin.',
          'Navigate between questions using the "Previous" and "Next" buttons.',
          'You can change your answers before submitting.',
          'Click "Submit Quiz" when you are ready — you cannot go back after submitting.',
          'After submission, you see your score, percentage, and a full question-by-question review.',
        ]} />
      </HelpSection>

      <HelpSection title="Question review">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          After submitting a quiz, each question shows:
        </p>
        <HelpList items={[
          'Whether your answer was correct or incorrect.',
          'The correct answer highlighted.',
          'A detailed explanation citing the specific IFAB Law and section.',
          'The law category and section tags for each question.',
        ]} />
      </HelpSection>

      <HelpSection title="Generating practice quizzes">
        <p className="text-sm text-white/60 mb-4 leading-relaxed">
          You can generate a custom practice quiz on any topic directly from your dashboard.
        </p>
        <HelpList items={[
          'In the "Recommendations" section, click the quiz icon next to a weak area.',
          'The AI generates a fresh 5-question quiz focused specifically on that topic.',
          'Generated quizzes appear in your quiz list and can be retaken.',
          'Each generated quiz has a unique title to avoid confusion.',
        ]} />
      </HelpSection>

      <HelpSection title="How quizzes affect your stats">
        <HelpList items={[
          'Every quiz attempt is saved and contributes to your law-by-law accuracy breakdown.',
          'Points are earned per correct question: typically 5 or 10 points.',
          'Completing a quiz counts as daily activity for your streak.',
          'Your quiz accuracy percentage is shown on the dashboard.',
        ]} />
      </HelpSection>
    </HelpArticleLayout>
  )
}
