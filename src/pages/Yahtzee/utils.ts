import { yahtzeeRows } from "./constants";
import type { Player } from "./constants";

export const calculatePlayerTotal = (player: Player): number => {
  return player.scores.reduce((total, score) => {
    if (score && score !== "x") {
      return total + parseInt(score);
    }
    return total;
  }, 0);
};

export const getWinningPlayers = (players: Player[]): number[] => {
  if (players.length === 0) return [];

  const playerTotals = players.map((player, idx) => ({
    idx,
    total: calculatePlayerTotal(player),
  }));

  const maxScore = Math.max(...playerTotals.map((p) => p.total));
  const winningPlayers = playerTotals
    .filter((p) => p.total === maxScore)
    .map((p) => p.idx);

  return winningPlayers;
};

export const getOptionsForRow = (
  rowIdx: number,
  yahtzeeRows: string[]
): string[] => {
  if (rowIdx >= 0 && rowIdx < 6) {
    const value = rowIdx + 1;
    const options = Array.from({ length: 5 }, (_, i) =>
      String(value * (i + 1))
    );
    options.push("x");
    return options;
  } else {
    const jugada = yahtzeeRows[rowIdx];
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
        return ["100", "120", "x"];
      default:
        return ["x"];
    }
  }
};

export const addNewPlayer = (players: Player[]): Player[] => [
  ...players,
  {
    name: `Jugador ${players.length + 1}`,
    scores: Array(yahtzeeRows.length).fill(""),
  },
];

export const removePlayer = (players: Player[], index: number): Player[] =>
  players.filter((_, i) => i !== index);

export const movePlayer = (
  players: Player[],
  index: number,
  direction: -1 | 1
): Player[] => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= players.length) return players;

  const newPlayers = [...players];
  [newPlayers[index], newPlayers[newIndex]] = [
    newPlayers[newIndex],
    newPlayers[index],
  ];
  return newPlayers;
};

export const resetAllScores = (players: Player[]): Player[] =>
  players.map((p) => ({
    ...p,
    scores: Array(yahtzeeRows.length).fill(""),
  }));
