# Yahtzee Game

Juego de Yahtzee (Generala) implementado en React con TypeScript.

## Estructura de archivos

```
src/pages/Yahtzee/
├── index.tsx              # Componente principal
├── constants.ts           # Constantes y tipos
├── utils.ts              # Funciones utilitarias
├── Yahtzee.css           # Estilos CSS tradicional
└── README.md             # Esta documentación
```

## Archivos

### `index.tsx`

Componente principal que contiene toda la lógica del juego:

- Gestión de estado de jugadores
- Renderizado de la tabla
- Manejo de eventos (agregar, eliminar, mover jugadores)
- Sistema de popovers para selección de puntajes

### `constants.ts`

Contiene todas las constantes del juego:

- `yahtzeeRows`: Array con los nombres de las jugadas
- `diceIcons`: Iconos de FontAwesome para los dados
- `Player`: Interfaz TypeScript para un jugador
- `initialPlayers`: Estado inicial de jugadores
- Funciones para obtener opciones de puntuación

### `utils.ts`

Funciones utilitarias para cálculos:

- `calculatePlayerTotal()`: Calcula el total de puntos de un jugador
- `getWinningPlayers()`: Encuentra jugadores empatados
- `getOptionsForRow()`: Obtiene opciones de puntuación según la fila

### `Yahtzee.css`

Estilos CSS tradicional organizados por componente:

- Estilos de contenedores
- Estilos de tabla
- Estilos de botones e inputs
- Estilos de popovers
- Clases condicionales para estados
- Prefijo `yahtzee-` para evitar conflictos

## Funcionalidades

- ✅ Gestión dinámica de jugadores
- ✅ Edición de nombres de jugadores
- ✅ Reordenamiento de columnas
- ✅ Sistema de puntuación con popovers
- ✅ Cálculo automático de totales
- ✅ Detección de ganadores y empates
- ✅ Reset de puntajes
- ✅ Diseño responsive
- ✅ Iconos de trofeo para ganadores

## Tecnologías utilizadas

- React 19
- TypeScript
- Radix UI Themes
- TanStack Table
- FontAwesome Icons
