// src/data/grammarData.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const grammarData: Question[] = [
  {
    id: 1,
    question: "Кыргыз тилинде канча жөндөмө бар?",
    options: ["4 жөндөмө", "6 жөндөмө", "7 жөндөмө", "5 жөндөмө"],
    correct: 1,
    explanation: "Кыргыз тилинде 6 жөндөмө бар: Атооч, Илик, Барыш, Табыш, Жатыш жана Чыгыш."
  },
  {
    id: 2,
    question: "'Китеп' сөзү кайсы жөндөмөдө турат?",
    options: ["Илик", "Атооч", "Табыш", "Жатыш"],
    correct: 1,
    explanation: "Эч кандай мүчөсү жок, баштапкы формада турган сөздөр Атооч жөндөмөсүндө болот."
  }
];