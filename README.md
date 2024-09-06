# Nada Playground

## Overview

Nada Playground is an interactive web application designed for developers to write, run, and share Nada code. This open-source project provides a user-friendly environment for learning and experimenting with Nada programming.

## Live Demo

Live demo here - [Nada Playground](https://nada-playground.netlify.app/)

## Features

- **Nada Code Editor**: Write and edit Nada programs with syntax highlighting.
- **Input Management**: Add and configure inputs for your Nada programs.
- **Output Display**: View the results of your Nada program executions.
- **Program Execution**: Compile and run Nada programs directly in the browser.
- **Share Functionality**: Share your Nada programs with others via custom links.
- **GitHub Integration**: Load Nada programs and inputs directly from GitHub repositories.
- **Example Programs**: Explore pre-loaded Nada examples to learn from.

## How to Use

1. **Write Code**: Use the code editor to write your Nada program.
2. **Configure Inputs**: Add inputs required for your program, specifying name, type, and value.
3. **Run Program**: Click the "Run" button to compile and execute your Nada code.
4. **View Outputs**: See the results of your program in the Outputs section.
5. **Share**: Use the share functionality to generate a link to your Nada program.
6. **Explore Examples**: Try out pre-loaded example programs to learn Nada programming concepts.

## Technical Details

- Built with [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [CodeMirror](https://codemirror.net/) for the code editor
- [Chakra UI](https://chakra-ui.com/) for the UI components
- Unit tests with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- Compiles the Nada program using the [jsnadac script](https://github.com/NillionNetwork/nada-sandbox/blob/gh-pages/jsnadac.html)
- Executes compiled programs using the [nada_run script](https://github.com/NillionNetwork/nada-sandbox/blob/gh-pages/nada_run.js)

## Todo

- **Nillion Testnet Integration**: Store your Nada programs on the Nillion Testnet.
