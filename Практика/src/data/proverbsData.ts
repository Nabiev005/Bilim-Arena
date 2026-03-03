export interface ProverbQuest {
  id: number;
  start: string; // Макалдын башы
  options: string[]; // Аягынын варианттары
  correct: number;
  explanation: string;
}

export const proverbsData: ProverbQuest[] = [
  {
    id: 1,
    start: "Өнөрлүү өлүптүр...",
    options: ["аты калыптыр", "өнөрү калыптыр", "эли калыптыр", "сөзү калыптыр"],
    correct: 1,
    explanation: "Макалдын толук түрү: 'Өнөрлүү өлүптүр, өнөрү калыптыр'."
  },
  {
    id: 2,
    start: "Окусаң озосуң...",
    options: ["бай болосуң", "акылдуу болосуң", "окубасаң тозосуң", "иштесең тозосуң"],
    correct: 2,
    explanation: "Макалдын толук түрү: 'Окусаң озосуң, окубасаң тозосуң'."
  }
];