import { useState, useMemo } from "react";
import { Table, Flex, Select } from "@radix-ui/themes";
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
} from "@fortawesome/free-solid-svg-icons";
import React from "react"; // Added missing import for React

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

const diceLabels = ["Dice 1", "Dice 2", "Dice 3", "Dice 4", "Dice 5", "Dice 6"];

type YahtzeeRow = {
  jugada: string;
  jugador1: string;
};

const initialData: YahtzeeRow[] = yahtzeeRows.map((jugada) => ({
  jugada,
  jugador1: "",
}));

const Yahtzee = () => {
  const [data] = useState<YahtzeeRow[]>(initialData);

  const columns = useMemo<ColumnDef<YahtzeeRow>[]>(
    () => [
      {
        accessorKey: "jugada",
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
                <span style={{ fontWeight: 500 }}>{diceLabels[idx]}</span>
              </span>
            );
          }
          return (
            <span style={{ fontWeight: 500 }}>{String(info.getValue())}</span>
          );
        },
      },
      {
        accessorKey: "jugador1",
        header: () => (
          <span style={{ fontWeight: 700, fontSize: 16 }}>Jugador 1</span>
        ),
        cell: (info) => {
          const idx = info.row.index;
          if (idx >= 0 && idx < 6) {
            // Dado 1 a 6: mostrar múltiplos de 1 a 5 y X
            const value = idx + 1;
            const options = Array.from({ length: 5 }, (_, i) =>
              String(value * (i + 1))
            );
            return (
              <Select.Root>
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
          if (info.row.original.jugada === "Escalera") {
            return (
              <Select.Root>
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
                  <Select.Item value="20">20</Select.Item>
                  <Select.Item value="25">25</Select.Item>
                  <Select.Item value="0">0</Select.Item>
                  <Select.Item value="x">X</Select.Item>
                </Select.Content>
              </Select.Root>
            );
          }
          if (info.row.original.jugada === "Full") {
            return (
              <Select.Root>
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
                  <Select.Item value="30">30</Select.Item>
                  <Select.Item value="35">35</Select.Item>
                  <Select.Item value="0">0</Select.Item>
                  <Select.Item value="x">X</Select.Item>
                </Select.Content>
              </Select.Root>
            );
          }
          if (info.row.original.jugada === "Poker") {
            return (
              <Select.Root>
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
                  <Select.Item value="40">40</Select.Item>
                  <Select.Item value="45">45</Select.Item>
                  <Select.Item value="0">0</Select.Item>
                  <Select.Item value="x">X</Select.Item>
                </Select.Content>
              </Select.Root>
            );
          }
          if (info.row.original.jugada === "Generala") {
            return (
              <Select.Root>
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
                  <Select.Item value="50">50</Select.Item>
                  <Select.Item value="55">55</Select.Item>
                  <Select.Item value="0">0</Select.Item>
                  <Select.Item value="x">X</Select.Item>
                </Select.Content>
              </Select.Root>
            );
          }
          if (info.row.original.jugada === "Doble Generala") {
            return (
              <Select.Root>
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
                  <Select.Item value="100">100</Select.Item>
                  <Select.Item value="0">0</Select.Item>
                  <Select.Item value="x">X</Select.Item>
                </Select.Content>
              </Select.Root>
            );
          }
          // Para cualquier otra fila, solo X
          return (
            <Select.Root>
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
                <Select.Item value="x">X</Select.Item>
              </Select.Content>
            </Select.Root>
          );
        },
      },
    ],
    []
  );

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
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>
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
                      textAlign:
                        cell.column.id === "jugador1" ? "center" : "left",
                      fontSize: 15,
                    }}
                  >
                    {/* Mejorar el trigger del Select para que tenga fondo y borde */}
                    {cell.column.id === "jugador1"
                      ? (() => {
                          const content = flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          );
                          if (
                            React.isValidElement(content) &&
                            typeof content.type === "function" &&
                            ((
                              content.type as {
                                displayName?: string;
                                name?: string;
                              }
                            ).displayName === "SelectRoot" ||
                              (
                                content.type as {
                                  displayName?: string;
                                  name?: string;
                                }
                              ).name === "SelectRoot")
                          ) {
                            const children = (
                              content.props as {
                                children: React.ReactNode;
                                key?: string;
                              }
                            ).children;
                            const key = (content.props as { key?: string }).key;
                            return (
                              <content.type
                                key={key}
                                children={React.Children.map(
                                  children,
                                  (child) => {
                                    if (
                                      React.isValidElement(child) &&
                                      typeof child.type === "function" &&
                                      ((
                                        child.type as {
                                          displayName?: string;
                                          name?: string;
                                        }
                                      ).displayName === "SelectTrigger" ||
                                        (
                                          child.type as {
                                            displayName?: string;
                                            name?: string;
                                          }
                                        ).name === "SelectTrigger")
                                    ) {
                                      return (
                                        <span
                                          style={{
                                            background: "#fff",
                                            border: "1px solid #d0d0d0",
                                            borderRadius: 8,
                                            padding: "6px 16px",
                                            minWidth: 80,
                                            textAlign: "center",
                                            boxShadow: "0 1px 4px #0001",
                                            cursor: "pointer",
                                            display: "inline-block",
                                          }}
                                        >
                                          {child}
                                        </span>
                                      );
                                    }
                                    return child;
                                  }
                                )}
                              />
                            );
                          }
                          return content;
                        })()
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
