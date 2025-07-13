import { useState, useMemo } from "react";
import {
  Table,
  Flex,
  Select,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@radix-ui/themes";
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
  faTrash,
  faPen,
  faArrowLeft,
  faArrowRight,
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

interface Player {
  name: string;
  scores: string[];
}

const initialPlayers: Player[] = [
  { name: "Jugador 1", scores: Array(yahtzeeRows.length).fill("") },
];

const Yahtzee = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // Eliminar jugador
  const handleRemovePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  // Mover jugador
  const handleMovePlayer = (idx: number, dir: -1 | 1) => {
    setPlayers((prev) => {
      const arr = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
    if (editingIdx === idx) setEditingIdx(idx + dir);
  };

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
    players.forEach((player, pIdx) => {
      base.push({
        id: `jugador${pIdx}`,
        header: () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {editingIdx === pIdx ? (
              <TextField.Root
                size="2"
                variant="surface"
                style={{ minWidth: 90 }}
              >
                <input
                  value={player.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newPlayers = [...players];
                    newPlayers[pIdx].name = e.target.value;
                    setPlayers(newPlayers);
                  }}
                  onBlur={() => setEditingIdx(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingIdx(null);
                  }}
                  autoFocus
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                  }}
                />
              </TextField.Root>
            ) : (
              <span
                style={{ fontWeight: 700, fontSize: 16, cursor: "pointer" }}
              >
                {player.name}
              </span>
            )}
            <Flex gap="1" justify="center" style={{ marginTop: 2 }}>
              <Tooltip content="Editar nombre">
                <IconButton
                  size="1"
                  variant="soft"
                  onClick={() => setEditingIdx(pIdx)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Eliminar jugador">
                <IconButton
                  size="1"
                  variant="soft"
                  color="red"
                  onClick={() => handleRemovePlayer(pIdx)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Mover a la izquierda">
                <IconButton
                  size="1"
                  variant="soft"
                  disabled={pIdx === 0}
                  onClick={() => handleMovePlayer(pIdx, -1)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Mover a la derecha">
                <IconButton
                  size="1"
                  variant="soft"
                  disabled={pIdx === players.length - 1}
                  onClick={() => handleMovePlayer(pIdx, 1)}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </IconButton>
              </Tooltip>
            </Flex>
          </div>
        ),
        cell: (info) => {
          const rowIdx = info.row.index;
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
      });
    });
    return base;
  }, [players, editingIdx]);

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
