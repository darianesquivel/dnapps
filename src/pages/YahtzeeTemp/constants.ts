import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
} from "@fortawesome/free-solid-svg-icons";

// Filas del juego Yahtzee
export const yahtzeeRows = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "Escalera",
  "Full",
  "Poker",
  "Generala",
  "Doble Generala",
];

// Iconos de dados para las primeras 6 filas
export const diceIcons = [
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
];

// Interfaz para un jugador
export interface Player {
  name: string;
  scores: string[];
}

// Jugador inicial
export const initialPlayers: Player[] = [
  { name: "Jugador 1", scores: Array(yahtzeeRows.length).fill("") },
  { name: "Jugador 2", scores: Array(yahtzeeRows.length).fill("") },
];

// Opciones de puntuación para filas de dados (1-6)
export const getDiceOptions = (diceValue: number): string[] => {
  const options = Array.from({ length: 5 }, (_, i) => String(diceValue * (i + 1)));
  options.push("x");
  return options;
};

// Opciones de puntuación para filas especiales
export const getSpecialOptions = (jugada: string): string[] => {
  switch (jugada) {
    case "Escalera":
      return ["20", "25", "0", "x"];
    case "Full":
      return ["30", "35", "0", "x"];
    case "Poker":
      return ["40", "45", "0", "x"];
    case "Generala":
      return ["50", "55", "0", "x"];
    case "Doble Generala":
      return ["100", "0", "x"];
    default:
      return ["x"];
  }
}; 