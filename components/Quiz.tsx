"use client"

import { useState } from "react"
import type { QuizSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { CheckCircle2, XCircle, Sparkles, Trophy, Target } from "lucide-react"
import { Progress } from "./ui/progress"

interface QuizProps {
  section: QuizSection
  brandColor: string
}

export function Quiz({ section, brandColor }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    section.questions.forEach((q, idx) => {
      if (q.correct && answers[idx] === q.correct) {
        totalScore += section.scoring?.correctPoints || 1
      }
    })
    setScore(totalScore)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  if (showResults && section.scoring?.showResults) {
    const maxScore = section.questions.length * (section.scoring?.correctPoints || 1)
    const percentage = (score / maxScore) * 100

    return (
      <Card className="overflow-hidden border-2">
        <CardHeader className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `linear-gradient(135deg, ${brandColor} 0%, transparent 100%)` }}
          />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${brandColor}20` }}>
              <Trophy className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <CardTitle>{section.title} - Results</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8 space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-2xl opacity-30 animate-pulse" style={{ background: brandColor }} />
              <div className="relative text-6xl font-bold" style={{ color: brandColor }}>
                {score} / {maxScore}
              </div>
            </div>
            <p className="text-xl text-muted-foreground">You scored {percentage.toFixed(0)}%!</p>
            <div className="max-w-md mx-auto">
              <Progress
                value={percentage}
                className="h-3"
                style={{
                  // @ts-ignore
                  "--progress-background": brandColor,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {section.questions.map((q, idx) => {
              const userAnswer = answers[idx]
              const isCorrect = q.correct && userAnswer === q.correct
              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md"
                  style={{
                    borderColor: isCorrect ? `${brandColor}40` : "hsl(var(--border))",
                    backgroundColor: isCorrect ? `${brandColor}05` : "transparent",
                  }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{q.prompt}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-semibold">Your answer:</span>{" "}
                        {q.choices.find((c) => c.value === userAnswer)?.label}
                      </p>
                      {!isCorrect && q.correct && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            <span className="font-semibold">Correct answer:</span>{" "}
                            {q.choices.find((c) => c.value === q.correct)?.label}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            onClick={resetQuiz}
            className="w-full group transition-all hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <Target className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = section.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / section.questions.length) * 100

  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `linear-gradient(135deg, ${brandColor} 0%, transparent 100%)` }}
        />
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${brandColor}20` }}>
              <Sparkles className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <CardTitle>
              {section.title} - Question {currentQuestion + 1} of {section.questions.length}
            </CardTitle>
          </div>
          <Progress
            value={progress}
            className="h-2"
            style={{
              // @ts-ignore
              "--progress-background": brandColor,
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-medium animate-in fade-in slide-in-from-right-4 duration-500">{question.prompt}</p>

        <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer}>
          <div className="space-y-3">
            {question.choices.map((choice, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 hover:border-current hover:shadow-md cursor-pointer animate-in fade-in slide-in-from-left-4"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  borderColor: answers[currentQuestion] === choice.value ? brandColor : "hsl(var(--border))",
                  backgroundColor: answers[currentQuestion] === choice.value ? `${brandColor}10` : "transparent",
                }}
              >
                <RadioGroupItem value={choice.value} id={`q${currentQuestion}-${idx}`} />
                <Label htmlFor={`q${currentQuestion}-${idx}`} className="cursor-pointer flex-1 font-medium">
                  {choice.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          className="w-full group transition-all hover:scale-105"
          style={{ backgroundColor: brandColor }}
        >
          {currentQuestion < section.questions.length - 1 ? "Next Question" : "See Results"}
          <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}
