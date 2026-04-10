# Rengine

Rengine is a small rendering and game engine experiment built in TypeScript. The project explores a few core engine ideas in a compact codebase: scenes, entities, folder-style transform hierarchies, game-loop updates, renderer abstraction, and lightweight animation components.

The demo app in this repo is a sandbox for visualizing those ideas. It can render through a canvas renderer or a React renderer, and the active demo scene is configured in [`src/Lifecycle.tsx`](./src/Lifecycle.tsx).

## What It Shows Off

- Entity construction through `Rengine.Entity.MakeEntity(...)`
- Nested transform composition through folder entities
- Scene creation and activation through `Rengine.Scene`
- A game-loop/update model separated from rendering
- Swappable rendering output (`canvas` or `react`)
- Debug transform markers for anchors, positions, and relationships

## Project Structure

- [`src/engine/engine.tsx`](./src/engine/engine.tsx)
  Aggregates the main engine modules and exposes helpers like vector math and color utilities.

- [`src/engine/entity.tsx`](./src/engine/entity.tsx)
  Defines entities and folder entities, including transform propagation and debug transformation-point rendering.

- [`src/engine/scene.tsx`](./src/engine/scene.tsx)
  Handles scene creation, activation, and scene/entity membership.

- [`src/engine/renderers.tsx`](./src/engine/renderers.tsx)
  Contains renderer helpers used by entities to draw themselves.

- [`src/engine/Loop.tsx`](./src/engine/Loop.tsx)
  Drives the update/render loop.

- [`src/Lifecycle.tsx`](./src/Lifecycle.tsx)
  Configures the active renderer, loop behavior, debug options, and which demo scene is loaded on startup.

## Demos

The built-in demos live in [`src/Lifecycle.tsx`](./src/Lifecycle.tsx). They focus on different transform and animation behaviors:

- `demoPurpleCube1`
  Nested rotating parents around a single cube.

- `demoPurpleCube2`
  Counter-rotation and parent motion to keep the child visually stable.

- `demoPurpleCube3`
  A more involved hierarchy with multiple animated rotating parents.

- `demoMultiCubeInLine`
  Multiple independently rotating cubes laid out in a line.

- `demoMultiCubeInPlace`
  Multiple cubes rotating around their own anchors.

- `demoTimeDif`
  A timing-oriented test used with the update loop.

## Debug Visualization

Transformation-point rendering can be toggled in [`src/Lifecycle.tsx`](./src/Lifecycle.tsx):

```ts
export const SHOW_TRANSFORMATION_POINTS: boolean = true;
```

When enabled, the debug overlay shows:

- Blue square: entity position
- Red square: entity anchor
- Black line: anchor-to-position relationship

This overlay is currently implemented for the canvas renderer path.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Build the project:

```bash
npm run build
```

## Why This Repo Exists

Rengine is less about shipping a complete game and more about experimenting with engine boundaries. It is a compact playground for testing how scene graphs, hierarchical transforms, update components, and rendering strategies fit together in TypeScript.
