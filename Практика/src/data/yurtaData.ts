// src/data/yurtaData.ts
import Босого from "../assets/Босого.png"
import Кереге from "../assets/Кереге.png"
import Түндүк from "../assets/Түндүк.png"
import Уук from "../assets/Уук.png"

export interface YurtaPart {
  id: string;
  name: string;
  step: number; // Куруу ирети
  image: string; // Сүрөт файлынын жолу
  description: string;
}

export const yurtaParts: YurtaPart[] = [
  { 
    id: 'bosogo', 
    name: 'Босого', 
    step: 1, 
    image: Босого, 
    description: 'Боз үйдүн пайдубалы жана эшик алкагы.' 
  },
  { 
    id: 'kerege', 
    name: 'Кереге', 
    step: 2, 
    image: Кереге, 
    description: 'Боз үйдүн жыгач дубалдары.' 
  },
  { 
    id: 'tyndyk', 
    name: 'Түндүк', 
    step: 3, 
    image: Түндүк, 
    description: 'Үйдүн эң жогорку бөлүгү, жарык жана аба кирүүчү жер.' 
  },
  { 
    id: 'uuk', 
    name: 'Уук', 
    step: 4, 
    image: Уук, 
    description: 'Кереге менен түндүктү бириктирүүчү шыргыйлар.' 
  }
];