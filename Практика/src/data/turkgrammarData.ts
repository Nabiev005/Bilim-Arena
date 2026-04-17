export interface Rule {
  type: string;
  items: string;
}

export interface Example {
  turkish: string;
  kyrgyz: string;
  note?: string;
}

export interface GrammarTopic {
  id: number;
  title: string;
  level: string;
  description: string;
  rules: Rule[];
  examples: Example[];
}

export const GRAMMAR_DATA: GrammarTopic[] = [
  {
    id: 1,
    title: 'Үндүүлөрдүн шайкештиги (Ünlü Uyumu)',
    level: 'A1',
    description: 'Түрк тилиндеги мүчөлөр сөздүн акыркы үндүү тыбышына карап уланат. Бул "Тилдин гармониясы" деп аталат.',
    rules: [
      { type: 'Жумшак (Kalın)', items: 'a, ı, o, u -> Мүчөдө "а" же "ı" болот' },
      { type: 'Ичке (İnce)', items: 'e, i, ö, ü -> Мүчөдө "e" же "i" болот' }
    ],
    examples: [
      { turkish: 'Okul-lar', kyrgyz: 'Мектептер', note: 'u -> lar' },
      { turkish: 'Göz-ler', kyrgyz: 'Көздөр', note: 'ö -> ler' },
      { turkish: 'Balık-lar', kyrgyz: 'Балыктар', note: 'ı -> lar' }
    ]
  },
  {
    id: 2,
    title: 'Көптүк мүчөлөр (-lar / -ler)',
    level: 'A1',
    description: 'Зат атоочторду көптүк түргө өткөрүү үчүн колдонулган эң жөнөкөй эреже.',
    rules: [
      { type: '-lar', items: 'Эгер сөздүн аягы жумшак үндүү менен бүтсө' },
      { type: '-ler', items: 'Эгер сөздүн аягы ичке үндүү менен бүтсө' }
    ],
    examples: [
      { turkish: 'Kitap-lar', kyrgyz: 'Китептер' },
      { turkish: 'Öğrenci-ler', kyrgyz: 'Студенттер' },
      { turkish: 'Bilgisayar-lar', kyrgyz: 'Компьютерлер' }
    ]
  },
  {
    id: 3,
    title: 'Жак мүчөлөр (Kişi Ekleri)',
    level: 'A1',
    description: 'Мен, сен, ал сыяктуу жактарга жараша этиштерге же зат атоочторго уланган мүчөлөр.',
    rules: [
      { type: 'Ben (Мен)', items: '-(y)ım, -(y)im, -(y)um, -(y)üm' },
      { type: 'Sen (Сен)', items: '-sın, -sin, -sun, -sün' }
    ],
    examples: [
      { turkish: 'Öğretmen-im', kyrgyz: 'Мен мугалиммин' },
      { turkish: 'Doktor-sun', kyrgyz: 'Сен доктурсуң' }
    ]
  }
];