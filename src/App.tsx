import { useState } from "react";
import { fetchQuizQuestions, QuestionState } from "./API";
// Components
import QuestionCard from "./components/QuestionCard";
// Types
import { Difficulty } from "./API";
// Styles
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

function App() {

  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [questionNr, setQuestionNr] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)


  const startQuiz = async () => {
    try {
      setLoading(true)
      setGameOver(false)

      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      )

      if (!newQuestions || newQuestions.length === 0) {
        throw new Error("No questions returned from API")
      }

      setQuestions(newQuestions)
      setScore(0)
      setUserAnswers([])
      setQuestionNr(0)
    } catch (error) {
    } finally {
      setLoading(false)
    }


  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // User's answer
      const answer = e.currentTarget.value
      // Check answer against correct answer
      const correct = questions[questionNr].correct_answer === answer
      // Add score is answer is correct
      if (correct) {
        setScore(prev => prev + 1)
      }
      // Save answer in the array for user's answers
      const answerObject: AnswerObject = {
        question: questions[questionNr].question,
        answer: answer,
        correct: correct,
        correctAnswer: questions[questionNr].correct_answer,
      }
      setUserAnswers((prev) => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    // Move on to the next question, if it is not the last question
    const nextQuestion = questionNr + 1

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setQuestionNr(nextQuestion)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startQuiz}>Start</button>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading && <p>Loading Questions ...</p>}
        {!loading && !gameOver && questions.length > questionNr && (
          <QuestionCard
            questionNr={questionNr + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[questionNr].question}
            answers={questions[questionNr].answers}
            userAnswer={userAnswers?.[questionNr]}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswers.length === questionNr + 1 && questionNr !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>Next question</button>
        ) : null}
      </Wrapper>
    </>
  )
}

export default App
