import createDOMPurify from 'dompurify'
import { AnswerObject } from '../App'
// Styles
import { Wrapper, ButtonWrapper } from './QuestionCard.styles'


type Props = {
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined;
    questionNr: number;
    totalQuestions: number;
}

const DOMPurify = createDOMPurify(window)

const QuestionCard: React.FC<Props> = ({ question, answers, callback, userAnswer, questionNr, totalQuestions }) => {

    const cleanQuestion = DOMPurify.sanitize(question)

    return (
        <Wrapper>
            <p className="questionNumber">Question: {questionNr} / {totalQuestions}</p>
            <p dangerouslySetInnerHTML={{ __html: cleanQuestion }} />
            <div>
                {Array.isArray(answers) && answers.length > 0 ? (
                    answers.map(answer => (
                        <ButtonWrapper
                            key={answer}
                            $correct={userAnswer?.correctAnswer === answer}
                            $userclicked={userAnswer?.answer === answer}>
                            <button disabled={userAnswer ? true : false} value={answer} onClick={callback}>
                                <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }} />
                            </button>
                        </ButtonWrapper>
                    ))) : (
                    <p>Loading answers...</p>
                )}
            </div>
        </Wrapper>
    )
}

export default QuestionCard;