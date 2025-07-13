import { useState, useMemo } from "react";
import { Table, Flex, Select, TextField, Button } from "@radix-ui/themes";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const yahtzeeRows = [
  "1 (unos)",
  "2 (doses)",
  "3 (treses)",
  "4 (cuatros)",
  "5 (cincos)",
  "6 (seises)",
  "Escalera",
  "Full",
  "Poker",
  "Generala",
  "Doble Generala",
];

const diceIcons = [
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
];

// Estado de cada jugador
interface Player {
  name: string;
  scores: string[]; // Un valor por jugada
}

const initialPlayers: Player[] = [
  { name: "Jugador 1", scores: Array(yahtzeeRows.length).fill("") },
];

const Yahtzee = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  // Botón para agregar jugador
  const handleAddPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      {
        name: `Jugador ${prev.length + 1}`,
        scores: Array(yahtzeeRows.length).fill(""),
      },
    ]);
  };

  // Columnas dinámicas: jugada + un header por jugador
  const columns = useMemo<ColumnDef<{ jugada: string }>[]>(() => {
    const base: ColumnDef<{ jugada: string }>[] = [
      {
        id: "jugada",
        header: () => (
          <span style={{ fontWeight: 700, fontSize: 16 }}>Jugada</span>
        ),
        cell: (info) => {
          const idx = info.row.index;
          if (idx >= 0 && idx < 6) {
            return (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FontAwesomeIcon
                  icon={diceIcons[idx]}
                  style={{ fontSize: 24, color: "#3b3b3b" }}
                />
              </span>
            );
          }
          return (
            <span style={{ fontWeight: 500 }}>{String(info.getValue())}</span>
          );
        },
        accessorFn: (row) => row.jugada,
      },
    ];
    // Una columna por jugador
    players.forEach((player, pIdx) => {
      base.push({
        id: `jugador${pIdx}`,
        header: () => (
          <TextField.Root size="2" variant="surface" style={{ minWidth: 90 }}>
            <input
              value={player.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newPlayers = [...players];
                newPlayers[pIdx].name = e.target.value;
                setPlayers(newPlayers);
              }}
              style={{
                textAlign: "center",
                fontWeight: 700,
                border: "none",
                background: "transparent",
                width: "100%",
              }}
            />
          </TextField.Root>
        ),
        cell: (info) => {
          const rowIdx = info.row.index;
          // Opciones para cada jugada
          if (rowIdx >= 0 && rowIdx < 6) {
            const value = rowIdx + 1;
            const options = Array.from({ length: 5 }, (_, i) =>
              String(value * (i + 1))
            );
            return (
              <Select.Root
                value={players[pIdx].scores[rowIdx]}
                onValueChange={(val) => {
                  const newPlayers = [...players];
                  newPlayers[pIdx].scores[rowIdx] = val;
                  setPlayers(newPlayers);
                }}
              >
                <Select.Trigger placeholder="Seleccionar" />
                <Select.Content
                  style={{
                    background: "#fff",
                    border: "1px solid #d0d0d0",
                    borderRadius: 8,
                    boxShadow: "0 4px 16px #0002",
                    padding: 4,
                    minWidth: 80,
                    zIndex: 10,
                  }}
                >
                  {options.map((opt) => (
                    <Select.Item key={opt} value={opt}>
                      {opt}
                    </Select.Item>
                  ))}
                  <Select.Item value="x">X</Select.Item>
                </Select.Content>
              </Select.Root>
            );
          }
          // Opciones especiales para las jugadas
          const jugada = yahtzeeRows[rowIdx];
          let opts: string[] = [];
          if (jugada === "Escalera") opts = ["20", "25", "0", "x"];
          else if (jugada === "Full") opts = ["30", "35", "0", "x"];
          else if (jugada === "Poker") opts = ["40", "45", "0", "x"];
          else if (jugada === "Generala") opts = ["50", "55", "0", "x"];
          else if (jugada === "Doble Generala") opts = ["100", "0", "x"];
          else opts = ["x"];
          return (
            <Select.Root
              value={players[pIdx].scores[rowIdx]}
              onValueChange={(val) => {
                const newPlayers = [...players];
                newPlayers[pIdx].scores[rowIdx] = val;
                setPlayers(newPlayers);
              }}
            >
              <Select.Trigger placeholder="Seleccionar" />
              <Select.Content
                style={{
                  background: "#fff",
                  border: "1px solid #d0d0d0",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px #0002",
                  padding: 4,
                  minWidth: 80,
                  zIndex: 10,
                }}
              >
                {opts.map((opt) => (
                  <Select.Item key={opt} value={opt}>
                    {opt}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          );
        },
        // accessorFn innecesario para columnas custom
      });
    });
    return base;
  }, [players]);

  // Datos para la tabla: una fila por jugada
  const data = useMemo(() => yahtzeeRows.map((jugada) => ({ jugada })), []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      width="100%"
      style={{ background: "#f5f5f5" }}
    >
      <Button onClick={handleAddPlayer} style={{ marginBottom: 24 }}>
        <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: 8 }} /> Agregar
        jugador
      </Button>
      <div style={{ width: "100%", margin: "0 auto" }}>
        <Table.Root
          variant="surface"
          style={{ width: "100%", margin: "0 auto" }}
        >
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeaderCell
                    key={header.id}
                    style={{
                      background: "#f0f0f0",
                      borderBottom: "2px solid #e0e0e0",
                      padding: "16px 8px",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row, i) => (
              <Table.Row
                key={row.id}
                style={{ background: i % 2 === 0 ? "#fff" : "#fafbfc" }}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    style={{
                      borderBottom: "1px solid #ececec",
                      padding: "12px 8px",
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </Flex>
  );
};

export default Yahtzee;
