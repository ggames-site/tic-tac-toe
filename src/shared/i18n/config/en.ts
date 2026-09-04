export const en = {
  translation: {
    document: { title: 'GGames — Tic-Tac-Toe' },
    language: { label: 'Language selection' },
    header: { brand: 'GGames — Tic-Tac-Toe', home: 'GGames — Tic-Tac-Toe, home', settings: 'Open settings' },
    game: {
      eyebrow: 'Classic 3 × 3 game', configure: 'Set up a match to start.', resultRecorded: 'The result has been recorded.', botThinking: 'Bot Master is thinking…', turn: '{{name}} is playing.', botName: 'Bot Master', board: 'Game board', liveTurn: 'Player {{mark}}’s turn', liveDraw: 'Draw', liveWin: '{{mark}} wins', emptyCell: 'Place a mark in cell {{index}}', filledCell: 'Cell {{index}}: {{mark}}', player: 'Player', opponent: 'Opponent', currentTurn: 'playing',
    },
    score: { match: 'Match score', draws: 'draws: {{count}}', aria: 'Score: {{x}} – {{o}}', unlimited: 'Unlimited', progress: 'Round {{current}} of {{total}}' },
    footer: { learnMore: 'Learn more about the game', wikipediaUrl: 'https://en.wikipedia.org/wiki/Tic-tac-toe' },
    setup: {
      modeTitle: 'Choose a format', modeDescription: 'Who will play the first round?', soloTitle: 'One player', soloDescription: 'Challenge Bot Master.', duoTitle: 'Two players', duoDescription: 'Take turns on the same board.', difficultyTitle: 'Bot Master difficulty', difficultyDescription: 'You can change it in settings later.', lengthTitle: 'Match length', soloLengthDescription: 'Test yourself against Bot Master.', duoLengthDescription: 'Choose the number of rounds in the match.', infiniteTitle: 'Unlimited', infiniteDescription: 'A new round starts automatically.', roundsTitle_one: '{{count}} round', roundsTitle_other: '{{count}} rounds', roundsDescription: 'Until the final result.',
    },
    difficulty: {
      easy: { title: 'Easy', description: 'The bot picks a free cell at random.' },
      medium: { title: 'Medium', description: 'The bot notices direct wins and threats.' },
      hard: { title: 'Hard', description: 'The bot plays optimally and makes no mistakes.' },
    },
    settings: { title: 'Settings', description: 'Saved names and difficulty remain after reloading the page.', playerX: 'Player X', playerO: 'Player O', botDifficulty: 'Bot Master difficulty', newGame: 'New game', save: 'Save' },
    result: { drawTitle: 'The match ended in a draw', winTitle: '{{name}} won', drawDescription: 'The scores are level.', winDescription: 'Great series — play again?', playAgain: 'Play again', draws: 'Draws' },
  },
} as const
