import createDOMPurify from 'dompurify'
import { AnswerObject } from '../App'
// Styles



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

    console.log(answers)

    return (
        <div>
            <p className="questionNumber">Question: {questionNr} / {totalQuestions}</p>
            <p dangerouslySetInnerHTML={{ __html: cleanQuestion }} />
            <div>
                {Array.isArray(answers) && answers.length > 0 ? (
                    answers.map(answer => (
                        <div key={answer}>
                            <button disabled={userAnswer ? true : false} value={answer} onClick={callback}>
                                <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }} />
                            </button>
                        </div>
                    ))) : (
                    <p>Loading answers...</p>
                )}
            </div>
        </div>
    )
}

export default QuestionCard;