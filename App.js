import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';

import params from './src/params';

import MineField from './src/components/MineField';
import Header from './src/components/Header';
import LevelSelection from './src/screens/LevelSelection';

import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './src/functions';

const App = () => {
  const cols = params.getColumnsAmount();
  const rows = params.getRowsAmount();

  const minesAmount = () => {
    return Math.ceil(cols * rows * params.difficultLevel);
  };

  const [board, setBoard] = useState(
    createMinedBoard(rows, cols, minesAmount()),
  );
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [showLevelSelection, setShowLevelSelection] = useState(false);

  const newGame = () => {
    setBoard(createMinedBoard(rows, cols, minesAmount()));
    setWon(false);
    setLost(false);
  };

  const onOpenField = (row, column) => {
    const clonedBoard = cloneBoard(board);
    openField(clonedBoard, row, column);
    const hasLost = hadExplosion(clonedBoard);
    const hasWon = wonGame(clonedBoard);

    if (hasLost) {
      showMines(clonedBoard);
      Alert.alert('Perdeeeeeu!', 'Que burro!');
    }

    if (hasWon) {
      Alert.alert('Parabéns', 'Você venceu!');
    }

    setBoard(clonedBoard);
    setLost(hasLost);
    setWon(hasWon);
  };

  const onSelectField = (row, column) => {
    const clonedBoard = cloneBoard(board);
    invertFlag(clonedBoard, row, column);
    const hasWon = wonGame(clonedBoard);

    if (hasWon) {
      Alert.alert('Parabéns', 'Você venceu!');
    }

    setBoard(clonedBoard);
    setWon(hasWon);
  };

  const onLevelSelected = level => {
    params.difficultLevel = level;
    newGame();
  };

  return (
    <View style={styles.container}>
      <LevelSelection
        isVisible={showLevelSelection}
        onLevelSelected={onLevelSelected}
        onCancel={() => setShowLevelSelection(false)}
      />
      <Header
        flagsLeft={minesAmount() - flagsUsed(board)}
        onNewGame={() => newGame()}
        onFlagPress={() => setShowLevelSelection(true)}
      />
      <View style={styles.board}>
        <MineField
          board={board}
          onOpenField={onOpenField}
          onSelectField={onSelectField}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA',
  },
});

export default App;
