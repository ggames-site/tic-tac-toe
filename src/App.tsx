import { lazy, Suspense, useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { GameBoard } from './components/GameBoard'
import { PlayerPanel } from './components/PlayerPanel'
import { Scoreboard } from './components/Scoreboard'
import { SeriesResultDialog } from './components/SeriesResultDialog'
import { SettingsDialog } from './components/SettingsDialog'
import { SetupDialog } from './components/SetupDialog'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { chooseBotMove } from './game/bot'
import { getPreferences, savePreferences } from './game/names'
import { getRoundResult, placeMark } from './game/rules'
import { EMPTY_BOARD } from './game/types'
import i18n from './i18n'
import type { Board, Difficulty, GameMode, Mark, MatchConfig, Player, RoundResult, Score } from './game/types'
import type { SetupStep } from './components/SetupDialog'

const BackgroundSpiral = lazy(async () => {
  const module = await import('./components/BackgroundSpiral')
  return { default: module.BackgroundSpiral }
})

interface GameState {
  board: Board
  currentMark: Mark
  outcome: RoundResult
  score: Score
  completedRounds: number
  config: MatchConfig | null
  mode: GameMode | null
  difficulty: Difficulty
  playerXName: string
  playerOName: string
  setupStep: SetupStep
  settingsOpen: boolean
  seriesResultOpen: boolean
}

type Action =
  | { type: 'SELECT_MODE'; mode: GameMode }
  | { type: 'SELECT_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_MATCH'; length: number | null }
  | { type: 'PLAY'; index: number }
  | { type: 'BOT_PLAY' }
  | { type: 'NEXT_ROUND' }
  | { type: 'OPEN_SETTINGS' }
  | { type: 'CLOSE_SETTINGS' }
  | { type: 'SAVE_PREFERENCES'; xName: string; oName: string; difficulty: Difficulty }
  | { type: 'SHOW_SERIES_RESULT' }
  | { type: 'RESET_MATCH' }

function createInitialState(): GameState {
  const preferences = getPreferences(i18n.resolvedLanguage === 'en' ? 'en' : 'ru')

  return {
    board: EMPTY_BOARD,
    currentMark: 'X',
    outcome: { kind: 'playing' },
    score: { X: 0, O: 0, draws: 0 },
    completedRounds: 0,
    config: null,
    mode: null,
    difficulty: preferences.difficulty,
    playerXName: preferences.playerXName,
    playerOName: preferences.playerOName,
    setupStep: 'mode',
    settingsOpen: false,
    seriesResultOpen: false,
  }
}

function updateScore(score: Score, outcome: RoundResult): Score {
  if (outcome.kind === 'draw') return { ...score, draws: score.draws + 1 }
  if (outcome.kind === 'win') return { ...score, [outcome.winner]: score[outcome.winner] + 1 }
  return score
}

function commitMove(state: GameState, index: number): GameState {
  if (state.config === null || state.outcome.kind !== 'playing' || state.board[index] !== null) return state

  const board = placeMark(state.board, index, state.currentMark)
  const outcome = getRoundResult(board)

  return {
    ...state,
    board,
    outcome,
    currentMark: outcome.kind === 'playing' ? (state.currentMark === 'X' ? 'O' : 'X') : state.currentMark,
    score: updateScore(state.score, outcome),
    completedRounds: outcome.kind === 'playing' ? state.completedRounds : state.completedRounds + 1,
  }
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SELECT_MODE':
      return { ...state, mode: action.mode, setupStep: action.mode === 'solo' ? 'difficulty' : 'length' }
    case 'SELECT_DIFFICULTY':
      return { ...state, difficulty: action.difficulty, setupStep: 'length' }
    case 'START_MATCH':
      if (state.mode === null) return state
      return {
        ...state,
        board: EMPTY_BOARD,
        currentMark: 'X',
        outcome: { kind: 'playing' },
        score: { X: 0, O: 0, draws: 0 },
        completedRounds: 0,
        config: { mode: state.mode, difficulty: state.difficulty, length: action.length },
        setupStep: null,
        seriesResultOpen: false,
      }
    case 'PLAY':
      if (state.config?.mode === 'solo' && state.currentMark === 'O') return state
      return commitMove(state, action.index)
    case 'BOT_PLAY':
      if (state.config?.mode !== 'solo' || state.currentMark !== 'O' || state.outcome.kind !== 'playing') return state
      return commitMove(state, chooseBotMove(state.board, state.config.difficulty))
    case 'NEXT_ROUND':
      return {
        ...state,
        board: EMPTY_BOARD,
        currentMark: 'X',
        outcome: { kind: 'playing' },
      }
    case 'OPEN_SETTINGS':
      return { ...state, settingsOpen: true }
    case 'CLOSE_SETTINGS':
      return { ...state, settingsOpen: false }
    case 'SAVE_PREFERENCES':
      return {
        ...state,
        playerXName: action.xName,
        playerOName: action.oName,
        difficulty: action.difficulty,
        config: state.config?.mode === 'solo' ? { ...state.config, difficulty: action.difficulty } : state.config,
      }
    case 'SHOW_SERIES_RESULT':
      return { ...state, seriesResultOpen: true }
    case 'RESET_MATCH':
      return {
        ...state,
        board: EMPTY_BOARD,
        currentMark: 'X',
        outcome: { kind: 'playing' },
        score: { X: 0, O: 0, draws: 0 },
        completedRounds: 0,
        config: null,
        mode: null,
        setupStep: 'mode',
        settingsOpen: false,
        seriesResultOpen: false,
      }
    default:
      return state
  }
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.7 4.1 10.3 2h3.4l.6 2.1 1.7.7 1.9-1.1 2.4 2.4-1.1 1.9.7 1.7 2.1.6v3.4l-2.1.6-.7 1.7 1.1 1.9-2.4 2.4-1.9-1.1-1.7.7-.6 2.1h-3.4l-.6-2.1-1.7-.7-1.9 1.1-2.4-2.4 1.1-1.9-.7-1.7-2.1-.6v-3.4l2.1-.6.7-1.7-1.1-1.9 2.4-2.4 1.9 1.1 1.7-.7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const { t } = useTranslation()
  const isSoloBotTurn = state.config?.mode === 'solo' && state.currentMark === 'O' && state.outcome.kind === 'playing'
  const isRoundFinished = state.outcome.kind !== 'playing'
  const isSeriesFinished = state.config?.length !== null && state.config !== null && state.completedRounds >= state.config.length
  const xPlayer: Player = { id: 'x', name: state.playerXName, mark: 'X', isBot: false }
  const oPlayer: Player = {
    id: 'o',
    name: state.config?.mode === 'solo' ? t('game.botName') : state.playerOName,
    mark: 'O',
    isBot: state.config?.mode === 'solo',
  }

  useEffect(() => {
    if (!isSoloBotTurn) return undefined

    const delay = 450 + Math.floor(Math.random() * 201)
    const timer = window.setTimeout(() => dispatch({ type: 'BOT_PLAY' }), delay)
    return () => window.clearTimeout(timer)
  }, [isSoloBotTurn, state.board, state.config?.difficulty])

  useEffect(() => {
    if (!isRoundFinished || state.config === null || state.seriesResultOpen) return undefined

    const timer = window.setTimeout(
      () => dispatch({ type: isSeriesFinished ? 'SHOW_SERIES_RESULT' : 'NEXT_ROUND' }),
      isSeriesFinished ? 1100 : 1350,
    )
    return () => window.clearTimeout(timer)
  }, [isRoundFinished, isSeriesFinished, state.config, state.seriesResultOpen])

  function selectDifficulty(difficulty: Difficulty) {
    savePreferences({ playerXName: state.playerXName, playerOName: state.playerOName, difficulty })
    dispatch({ type: 'SELECT_DIFFICULTY', difficulty })
  }

  function saveSettings(values: { xName: string; oName: string; difficulty: Difficulty }) {
    savePreferences({ playerXName: values.xName, playerOName: values.oName, difficulty: values.difficulty })
    dispatch({ type: 'SAVE_PREFERENCES', ...values })
  }

  return (
    <div className="app-shell">
      <Suspense fallback={null}>
        <BackgroundSpiral />
      </Suspense>
      <header className="site-header">
        <div className="site-header__top">
          <a className="brand" href="/" aria-label={t('header.home')}>
            <img className="brand__icon" src="/favicon-64.png" width="32" height="32" alt="" aria-hidden="true" />
            <span>{t('header.brand')}</span>
          </a>
          <div className="header-actions">
            <LanguageSwitcher />
            <button type="button" className="icon-button" aria-label={t('header.settings')} onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}>
              <SettingsIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="game-layout">
        <p className="eyebrow game-layout__eyebrow">{t('game.eyebrow')}</p>
        <div className="match-summary">
          <PlayerPanel player={xPlayer} isCurrent={state.currentMark === 'X' && !isRoundFinished} />
          <Scoreboard
            score={state.score}
            completedRounds={state.completedRounds}
            length={state.config?.length ?? null}
          />
          <PlayerPanel player={oPlayer} isCurrent={state.currentMark === 'O' && !isRoundFinished} />
        </div>
        <GameBoard
          board={state.board}
          currentMark={state.currentMark}
          outcome={state.outcome}
          isLocked={state.config === null || isSoloBotTurn || isRoundFinished}
          onSelect={(index) => dispatch({ type: 'PLAY', index })}
        />
        <p className="game-hint">
          {state.config === null
            ? t('game.configure')
            : isRoundFinished
              ? t('game.resultRecorded')
              : isSoloBotTurn
                ? t('game.botThinking')
                : t('game.turn', { name: state.currentMark === 'X' ? xPlayer.name : oPlayer.name })}
        </p>
      </main>

      <footer className="site-footer">
        <span>© 2026 GGames</span>
        <a href={t('footer.wikipediaUrl')} target="_blank" rel="noreferrer">
          {t('footer.learnMore')} <span aria-hidden="true">↗</span>
        </a>
      </footer>

      <SetupDialog
        step={state.setupStep}
        mode={state.mode}
        difficulty={state.difficulty}
        onModeSelect={(mode) => dispatch({ type: 'SELECT_MODE', mode })}
        onDifficultySelect={selectDifficulty}
        onLengthSelect={(length) => dispatch({ type: 'START_MATCH', length })}
      />
      <SettingsDialog
        isOpen={state.settingsOpen}
        mode={state.config?.mode ?? state.mode}
        difficulty={state.difficulty}
        xName={state.playerXName}
        oName={state.playerOName}
        onClose={() => dispatch({ type: 'CLOSE_SETTINGS' })}
        onSave={saveSettings}
        onNewGame={() => dispatch({ type: 'RESET_MATCH' })}
      />
      <SeriesResultDialog
        isOpen={state.seriesResultOpen}
        xName={xPlayer.name}
        oName={oPlayer.name}
        xScore={state.score.X}
        oScore={state.score.O}
        draws={state.score.draws}
        onPlayAgain={() => dispatch({ type: 'RESET_MATCH' })}
      />
    </div>
  )
}
