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
import { useNavigate } from "react-router-dom";
import { Text } from "@radix-ui/themes";

const Yahtzee = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [openPopover, setOpenPopover] = useState<{
    playerIdx: number;
    rowIdx: number;
  } | null>(null);

  const navigate = useNavigate();

  const handleRemovePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

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

  const handleAddPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      {
        name: `Jugador ${prev.length + 1}`,
        scores: Array(yahtzeeRows.length).fill(""),
      },
    ]);
  };

  const handleResetScores = () => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        scores: Array(yahtzeeRows.length).fill(""),
      }))
    );
    setOpenPopover(null);
  };

  const columns = useMemo<ColumnDef<{ jugada: string }>[]>(() => {
    const base: ColumnDef<{ jugada: string }>[] = [
      {
        id: "jugador",
        header: () => (
          <Flex justify={"center"}>
            <Text>Jugador</Text>
          </Flex>
        ),
        cell: (info) => {
          const idx = info.row.index;
          if (idx >= 0 && idx < 6) {
            return (
              <Flex justify="center">
                <FontAwesomeIcon size="xl" icon={diceIcons[idx]} />
              </Flex>
            );
          }
          if (idx === yahtzeeRows.length) {
            return (
              <Flex justify="center">
                <Text>TOTAL</Text>
              </Flex>
            );
          }
          return (
            <Flex justify="center">
              <Text>{String(info.getValue())}</Text>
            </Flex>
          );
        },
        accessorFn: (row) => row.jugada,
      },
    ];
    players.forEach((player, pIdx) => {
      base.push({
        id: `jugador${pIdx}`,
        header: () => (
          <Flex
            direction={"column"}
            justify={"center"}
            align={"center"}
            gap={"2"}
          >
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
              />
            ) : (
              <Text>{player.name}</Text>
            )}
            <Flex gap={"1"} justify={"center"} align={"center"}>
              <Tooltip content="Editar nombre">
                <IconButton
                  size="1"
                  variant="surface"
                  radius="full"
                  onClick={() => setEditingIdx(pIdx)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Eliminar jugador">
                <IconButton
                  size="1"
                  variant="surface"
                  color="red"
                  radius="full"
                  onClick={() => handleRemovePlayer(pIdx)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Mover a la izquierda">
                <IconButton
                  size="1"
                  variant="surface"
                  radius="full"
                  disabled={pIdx === 0}
                  onClick={() => handleMovePlayer(pIdx, -1)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Mover a la derecha">
                <IconButton
                  size="1"
                  variant="surface"
                  radius="full"
                  disabled={pIdx === players.length - 1}
                  onClick={() => handleMovePlayer(pIdx, 1)}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </IconButton>
              </Tooltip>
            </Flex>
          </Flex>
        ),
        cell: (info) => {
          const rowIdx = info.row.index;
          if (rowIdx === yahtzeeRows.length) {
            const total = calculatePlayerTotal(players[pIdx]);
            const winningPlayers = getWinningPlayers(players);
            const isWinning = winningPlayers.includes(pIdx);

            return (
              <Flex gap={"2"} justify={"center"} align={"center"}>
                {isWinning && <FontAwesomeIcon icon={faTrophy} color="gold" />}
                <Text weight={isWinning ? "bold" : "light"}>{total}</Text>
              </Flex>
            );
          }

          const currentValue = players[pIdx].scores[rowIdx];
          const isOpen =
            openPopover?.playerIdx === pIdx && openPopover?.rowIdx === rowIdx;

          const options = getOptionsForRow(rowIdx, yahtzeeRows);

          const handleSelectOption = (option: string) => {
            const newPlayers = [...players];
            newPlayers[pIdx].scores[rowIdx] = option;
            setPlayers(newPlayers);
            setOpenPopover(null);
          };

          return (
            <Flex justify={"center"}>
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
                  <Button variant="ghost">{currentValue || "..."}</Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Flex direction="column" gap="2">
                    {options.map((option) => (
                      <Button
                        variant="ghost"
                        key={option}
                        onClick={() => handleSelectOption(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </Flex>
                </Popover.Content>
              </Popover.Root>
            </Flex>
          );
        },
      });
    });
    return base;
  }, [players, editingIdx, openPopover]);

  const data = useMemo(() => {
    const baseData = yahtzeeRows.map((jugada) => ({ jugada }));
    baseData.push({ jugada: "TOTAL" });
    return baseData;
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex
      direction={"column"}
      justify={"center"}
      align={"center"}
      gap={"3"}
      maxHeight={"100vh"}
    >
      <Flex gap="9">
        <Button onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <Flex gap="3">
          <Button variant="soft" color="green" onClick={handleAddPlayer}>
            <FontAwesomeIcon icon={faUserPlus} />
          </Button>
          <Button variant="soft" color="tomato" onClick={handleResetScores}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </Button>
        </Flex>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeaderCell key={header.id}>
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
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default Yahtzee;
