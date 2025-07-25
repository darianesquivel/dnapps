import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
} from "@fortawesome/free-solid-svg-icons";

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
  "X2 Generala",
];

export const diceIcons = [
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
];

export interface Player {
  name: string;
  scores: string[];
}

export const initialPlayers: Player[] = [
  { name: "Pame", scores: Array(yahtzeeRows.length).fill("") },
  { name: "Tomi", scores: Array(yahtzeeRows.length).fill("") },
  { name: "Gene", scores: Array(yahtzeeRows.length).fill("") },
  { name: "Dari", scores: Array(yahtzeeRows.length).fill("") },
];

export const getDiceOptions = (diceValue: number): string[] => {
  const options = Array.from({ length: 5 }, (_, i) =>
    String(diceValue * (i + 1))
  );
  options.push("x");
  return options;
};

export const getSpecialOptions = (jugada: string): string[] => {
  switch (jugada) {
    case "Escalera":
      return ["20", "25", "x"];
    case "Full":
      return ["30", "35", "x"];
    case "Poker":
      return ["40", "45", "x"];
    case "Generala":
      return ["50", "60", "x"];
    case "X2 Generala":
      return ["100", "120", "0", "x"];
    default:
      return ["x"];
  }
};
