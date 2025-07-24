import type { Player } from "./constants";

// Calcular total de un jugador
export const calculatePlayerTotal = (player: Player): number => {
  return player.scores.reduce((total, score) => {
    if (score && score !== "x") {
      return total + parseInt(score);
    }
    return total;
  }, 0);
};

// Encontrar jugadores empatados
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

// Obtener opciones según el tipo de jugada
export const getOptionsForRow = (rowIdx: number, yahtzeeRows: string[]): string[] => {
  if (rowIdx >= 0 && rowIdx < 6) {
    // Filas de dados (1-6)
    const value = rowIdx + 1;
    const options = Array.from({ length: 5 }, (_, i) => String(value * (i + 1)));
    options.push("x");
    return options;
  } else {
    // Filas especiales
    const jugada = yahtzeeRows[rowIdx];
    switch (jugada) {
      case "Escalera":
        return ["20", "25", "x"];
      case "Full":
        return ["30", "35", "x"];
      case "Poker":
        return ["40", "45", "x"];
      case "Generala":
        return ["50", "55", "x"];
      case "Doble Generala":
        return ["100", "x"];
      default:
        return ["x"];
    }
  }
}; 