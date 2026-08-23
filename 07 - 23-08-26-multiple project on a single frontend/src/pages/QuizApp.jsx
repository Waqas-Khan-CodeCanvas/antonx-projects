import { useEffect, useState, useCallback } from 'react'
import PageChrome from '../components/layout/PageChrome'
import QuestionCard from '../features/quiz/QuestionCard'
import ResultsScreen from '../features/quiz/ResultsScreen'
import { quizQuestions } from '../data/quizQuestions'
import { Play } from 'lucide-react'

const QUESTION_TIME = 15

export default function QuizApp() {
  const [stage, setStage] = useState('idle') // idle | active | finished
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)

  const currentQuestion = quizQuestions[currentIndex]

  const goToNext = useCallback(() => {
    setSelected(null)
    setTimeLeft(QUESTION_TIME)
    setCurrentIndex((i) => {
      if (i + 1 >= quizQuestions.length) {
        setStage('finished')
        return i
      }
      return i + 1
    })
  }, [])

  const handleAnswer = useCallback((optionIndex) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === currentQuestion.correctIndex) setScore((s) => s + 1)
    setTimeout(goToNext, 900)
  }, [selected, currentQuestion, goToNext])

  useEffect(() => {
    if (stage !== 'active' || selected !== null) return
    if (timeLeft === 0) {
      handleAnswer(-1) // no answer selected in time — counted incorrect
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [stage, timeLeft, selected, handleAnswer])

  const start = () => {
    setStage('active')
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setTimeLeft(QUESTION_TIME)
  }

  return (
    <div>
      <PageChrome
        eyebrow="module 02"
        title="Trivia Engine"
        description="Ten questions, fifteen seconds each. No going back."
        meta={stage === 'active' ? `question ${currentIndex + 1} / ${quizQuestions.length}` : `${quizQuestions.length} questions`}
      />

      <div className="container-page max-w-2xl py-12">
        {stage === 'idle' && (
          <div className="rounded-xl border border-line bg-surface p-10 text-center dark:border-line-dark dark:bg-ink-2">
            <h2 className="font-display text-2xl font-semibold">Ready when you are.</h2>
            <p className="mt-2 text-sm text-ink-soft dark:text-paper/50">
              {quizQuestions.length} questions · {QUESTION_TIME}s per question · instant feedback
            </p>
            <button onClick={start} className="mx-auto mt-6 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-indigo dark:bg-indigo dark:text-ink">
              <Play size={16} /> Start quiz
            </button>
          </div>
        )}

        {stage === 'active' && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={quizQuestions.length}
            selected={selected}
            timeLeft={timeLeft}
            totalTime={QUESTION_TIME}
            onAnswer={handleAnswer}
          />
        )}

        {stage === 'finished' && (
          <ResultsScreen score={score} total={quizQuestions.length} onRestart={start} />
        )}
      </div>
    </div>
  )
}