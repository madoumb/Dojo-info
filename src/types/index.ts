export type Filiere = "tssr" | "tai" | "ais";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  filiere: Filiere;
  level: "débutant" | "intermédiaire" | "avancé";
  duration: string;
  modules: number;
  image: string;
  tags: string[];
  updatedAt: string;
  objectives: string[];
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

export interface TechEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  category: "hardware" | "software" | "ia" | "securite" | "reseau";
  url: string;
  description: string;
  upcoming: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: string;
  image: string;
  url: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
