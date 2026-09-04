export const ru = {
  translation: {
    document: { title: 'GGames — Крестики-нолики' },
    language: { label: 'Выбор языка' },
    header: { brand: 'GGames — Крестики-нолики', home: 'GGames — Крестики-нолики, на главную', settings: 'Открыть настройки' },
    game: {
      eyebrow: 'Классическая игра 3 × 3', configure: 'Настройте матч, чтобы начать.', resultRecorded: 'Результат зафиксирован.', botThinking: 'Бот-Мастер обдумывает ход…', turn: 'Ходит {{name}}.', botName: 'Бот-Мастер', board: 'Игровая доска', liveTurn: 'Ход игрока {{mark}}', liveDraw: 'Ничья', liveWin: 'Победили {{mark}}', emptyCell: 'Поставить знак в клетку {{index}}', filledCell: 'Клетка {{index}}: {{mark}}', player: 'Игрок', opponent: 'Соперник', currentTurn: 'ходит',
    },
    score: { match: 'Счёт матча', draws: 'ничьи: {{count}}', aria: 'Счёт: {{x}} – {{o}}', unlimited: 'Без лимита', progress: 'Партия {{current}} из {{total}}' },
    footer: { learnMore: 'Подробнее об игре', wikipediaUrl: 'https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B5%D1%81%D1%82%D0%B8%D0%BA%D0%B8-%D0%BD%D0%BE%D0%BB%D0%B8%D0%BA%D0%B8' },
    setup: {
      modeTitle: 'Выберите формат', modeDescription: 'С кем сыграем первую партию?', soloTitle: 'Для одного', soloDescription: 'Сразитесь с Бот-Мастером.', duoTitle: 'Для двоих', duoDescription: 'Ходите по очереди на одной доске.', difficultyTitle: 'Уровень Бот-Мастера', difficultyDescription: 'Его можно будет изменить в настройках.', lengthTitle: 'Длина матча', soloLengthDescription: 'Проверьте себя против Бот-Мастера.', duoLengthDescription: 'Выберите число партий для матча.', infiniteTitle: 'Бесконечно', infiniteDescription: 'Новая партия начнётся автоматически.', roundsTitle_one: '{{count}} партия', roundsTitle_few: '{{count}} партии', roundsTitle_many: '{{count}} партий', roundsTitle_other: '{{count}} партии', roundsDescription: 'До финального результата.',
    },
    difficulty: {
      easy: { title: 'Легко', description: 'Бот выбирает свободные клетки случайно.' },
      medium: { title: 'Средне', description: 'Бот замечает прямые победы и угрозы.' },
      hard: { title: 'Сложно', description: 'Бот играет оптимально и не ошибается.' },
    },
    settings: { title: 'Настройки', description: 'Сохранённые имена и уровень останутся после обновления страницы.', playerX: 'Игрок X', playerO: 'Игрок O', botDifficulty: 'Сложность Бот-Мастера', newGame: 'Новая игра', save: 'Сохранить' },
    result: { drawTitle: 'Матч завершён вничью', winTitle: 'Победил {{name}}', drawDescription: 'Силы оказались равны.', winDescription: 'Отличная серия — сыграете ещё?', playAgain: 'Играть снова', draws: 'Ничьи' },
  },
} as const
