import { createContext, ReactNode, useCallback, useContext } from "react";

import { useState } from "react"

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[]; //or Array<Episode>
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (episode: Episode[], index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  playNext: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({children} :PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  /* ******* TESTING USECALLBACK ******* */
  /*
  const play = useCallback(episode => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }, [setEpisodeList, setCurrentEpisodeIndex, setIsPlaying])
  */
  /* ******* TESTING USECALLBACK ******* */

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex+1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext(){
    if(isShuffling){
      //Math.floor is to round the final random index
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }
    else if(hasNext)
      setCurrentEpisodeIndex(currentEpisodeIndex+1)
  }

  function playPrevious(){
    if(hasPrevious)
      setCurrentEpisodeIndex(currentEpisodeIndex-1)
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return(
    <PlayerContext.Provider
      value={
        {
          episodeList,
          currentEpisodeIndex,
          isPlaying,
          isLooping,
          isShuffling,
          play,
          togglePlay,
          setPlayingState,
          playList,
          hasNext,
          hasPrevious,
          playNext,
          playPrevious,
          toggleLoop,
          toggleShuffle,
          clearPlayerState
        }
      }
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}