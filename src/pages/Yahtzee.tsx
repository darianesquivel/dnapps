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
        cell: () => (
          <Select.Root>
            <Select.Trigger></Select.Trigger>
            <Select.Content>
              <Select.Item value="1">1</Select.Item>
              <Select.Item value="2">2</Select.Item>
              <Select.Item value="3">3</Select.Item>
              <Select.Item value="4">4</Select.Item>
              <Select.Item value="5">5</Select.Item>
              <Select.Item value="6">6</Select.Item>
              <Select.Item value="x">X</Select.Item>
            </Select.Content>
          </Select.Root>
        ),
      },
    ],
    [data]
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
    >
      <Table.Root variant="surface">
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
