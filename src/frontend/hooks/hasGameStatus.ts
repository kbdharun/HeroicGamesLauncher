import { useEffect, useState } from 'react'
import { GameStatus } from 'common/types'

export const hasGameStatus = (appName: string) => {
  const defaultGameStatus: GameStatus = {
    appName,
    status: 'done',
    folder: 'default',
    runner: 'legendary',
    progress: {
      bytes: '0.00MiB',
      eta: '00:00:00',
      percent: 0,
      folder: 'default'
    },
    previousProgress: {
      bytes: '0.00MiB',
      eta: '00:00:00',
      percent: 0,
      folder: 'default'
    }
  }

  const [currentGameStatus, setCurrentGameStatus] =
    useState<GameStatus>(defaultGameStatus)

  const calculatePercent = (gameStatus: GameStatus) => {
    // current/100 * (100-heroic_stored) + heroic_stored
    if (gameStatus.previousProgress?.percent) {
      const currentPercent = gameStatus.progress?.percent
      const storedPercent = gameStatus.previousProgress?.percent
      if (currentPercent !== undefined) {
        const newPercent: number = Math.round(
          (currentPercent / 100) * (100 - storedPercent) + storedPercent
        )
        if (gameStatus.progress) {
          gameStatus.progress.percent = newPercent
        }
      }
    }
    return gameStatus
  }

  useEffect(() => {
    window.api.getGameStatus(appName).then((gameStatus: GameStatus) => {
      if (gameStatus) {
        setCurrentGameStatus({ ...calculatePercent(gameStatus) })
      }
    })

    const onGameStatusUpdate = async (
      _e: Electron.IpcRendererEvent,
      gameStatus: GameStatus
    ) => {
      if (gameStatus && appName === gameStatus.appName) {
        setCurrentGameStatus({ ...calculatePercent(gameStatus) })
      }
    }

    const setGameStatusRemoveListener =
      window.api.handleGameStatus(onGameStatusUpdate)

    return () => {
      setGameStatusRemoveListener()
    }
  }, [])

  return [currentGameStatus]
}