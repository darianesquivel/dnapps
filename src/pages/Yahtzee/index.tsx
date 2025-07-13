import { useState, useMemo } from "react";
import {
  Table,
  Flex,
  Button,
  IconButton,
  Tooltip,
  Popover,
} from "@radix-ui/themes";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faTrash,
  faPen,
  faArrowLeft,
  faArrowRight,
  faTrophy,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

// Importaciones locales
import {
  yahtzeeRows,
  diceIcons,
  initialPlayers,
  type Player,
} from "./constants";
import {
  calculatePlayerTotal,
  getWinningPlayers,
  getOptionsForRow,
} from "./utils";
import "./Yahtzee.css";

const Yahtzee = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [openPopover, setOpenPopover] = useState<{
    playerIdx: number;
    rowIdx: number;
  } | null>(null);

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

  // Resetear todos los puntajes
  const handleResetScores = () => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        scores: Array(yahtzeeRows.length).fill(""),
      }))
    );
    setOpenPopover(null);
  };

  // Columnas dinámicas: jugada + un header por jugador
  const columns = useMemo<ColumnDef<{ jugada: string }>[]>(() => {
    const base: ColumnDef<{ jugada: string }>[] = [
      {
        id: "jugada",
        header: () => <span className="yahtzee-jugada-header">Jugada</span>,
        cell: (info) => {
          const idx = info.row.index;
          if (idx >= 0 && idx < 6) {
            return (
              <span className="yahtzee-dice-container">
                <FontAwesomeIcon
                  icon={diceIcons[idx]}
                  className="yahtzee-dice-icon"
                />
              </span>
            );
          }
          if (idx === yahtzeeRows.length) {
            return <span className="yahtzee-total-text">TOTAL</span>;
          }
          return (
            <span className="yahtzee-jugada-text">
              {String(info.getValue())}
            </span>
          );
        },
        accessorFn: (row) => row.jugada,
      },
    ];
    players.forEach((player, pIdx) => {
      base.push({
        id: `jugador${pIdx}`,
        header: () => (
          <div className="yahtzee-player-header">
            {editingIdx === pIdx ? (
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
                className="yahtzee-name-input"
              />
            ) : (
              <span className="yahtzee-player-name">{player.name}</span>
            )}
            <Flex gap="1" justify="center" className="yahtzee-player-actions">
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

          // Si es la fila de totales
          if (rowIdx === yahtzeeRows.length) {
            const total = calculatePlayerTotal(players[pIdx]);
            const winningPlayers = getWinningPlayers(players);
            const isWinning = winningPlayers.includes(pIdx);
            const isTie = winningPlayers.length > 1;

            return (
              <div
                className={`yahtzee-total-container ${
                  isWinning
                    ? "yahtzee-total-container-winning"
                    : "yahtzee-total-container-normal"
                }`}
              >
                {isWinning && (
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className={`yahtzee-trophy-icon ${
                      isTie
                        ? "yahtzee-trophy-icon-tie"
                        : "yahtzee-trophy-icon-winner"
                    }`}
                  />
                )}
                {total}
              </div>
            );
          }

          const currentValue = players[pIdx].scores[rowIdx];
          const isOpen =
            openPopover?.playerIdx === pIdx && openPopover?.rowIdx === rowIdx;

          // Obtener opciones según el tipo de jugada
          const options = getOptionsForRow(rowIdx, yahtzeeRows);

          const handleSelectOption = (option: string) => {
            const newPlayers = [...players];
            newPlayers[pIdx].scores[rowIdx] = option;
            setPlayers(newPlayers);
            setOpenPopover(null);
          };

          return (
            <Popover.Root
              open={isOpen}
              onOpenChange={(open) => {
                if (open) {
                  setOpenPopover({ playerIdx: pIdx, rowIdx });
                } else {
                  setOpenPopover(null);
                }
              }}
            >
              <Popover.Trigger>
                <button
                  className={`yahtzee-popover-trigger ${
                    currentValue
                      ? "yahtzee-popover-trigger-filled"
                      : "yahtzee-popover-trigger-empty"
                  }`}
                >
                  {currentValue || "—"}
                </button>
              </Popover.Trigger>
              <Popover.Content className="yahtzee-popover-content">
                <Flex direction="column" gap="1">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelectOption(option)}
                      className={`yahtzee-option-button ${
                        option === currentValue
                          ? "yahtzee-option-button-selected"
                          : "yahtzee-option-button-normal"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </Flex>
              </Popover.Content>
            </Popover.Root>
          );
        },
      });
    });
    return base;
  }, [players, editingIdx, openPopover]);

  const data = useMemo(() => {
    const baseData = yahtzeeRows.map((jugada) => ({ jugada }));
    // Agregar fila de totales
    baseData.push({ jugada: "TOTAL" });
    return baseData;
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex className="yahtzee-container">
      <Flex gap="3" className="yahtzee-action-buttons">
        <Button onClick={handleAddPlayer}>
          <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: 8 }} />{" "}
          Agregar jugador
        </Button>
        <Button variant="soft" color="orange" onClick={handleResetScores}>
          <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: 8 }} />{" "}
          Resetear puntajes
        </Button>
      </Flex>
      <div className="yahtzee-table-container">
        <Table.Root variant="surface" className="yahtzee-table">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeaderCell
                    key={header.id}
                    className="yahtzee-header-cell"
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
                className={i % 2 === 0 ? "yahtzee-row-even" : "yahtzee-row-odd"}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id} className="yahtzee-body-cell">
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
