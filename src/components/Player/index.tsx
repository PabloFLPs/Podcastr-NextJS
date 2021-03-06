//import "./styles.module.scss"
import { useCallback, useEffect, useRef, useState } from "react"
import { usePlayer } from "../../contexts/PlayerContext"
import styles from "./styles.module.scss"
import Image from "next/image"

import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

export default function Player(){
  const audioRef = useRef<HTMLAudioElement>(null)

  const [progress, setProgress] = useState(0)
  
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    setPlayingState,
    hasNext,
    hasPrevious,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
    clearPlayerState
  } = usePlayer()

  /* ******* TESTING USECALLBACK ******* */
  /*
  const toggleAudio = useCallback(() => {
    if(!audioRef.current) return
    if(isPlaying) audioRef.current.play()
    else audioRef.current.pause()
  }, [isPlaying])
  */
  /* ******* TESTING USECALLBACK ******* */

  useEffect(() => {
    //toggleAudio
    if(!audioRef.current) return
    if(isPlaying) audioRef.current.play()
    else audioRef.current.pause()
  }, [isPlaying])
  
  /* ******* TESTING USECALLBACK ******* */
  /*
  const keyPressPlay = useCallback ((event) => {
    if(event.key === "p" || event.key === "s"){
      if(audioRef.current.paused) audioRef.current.play()
      else audioRef.current.pause()
    }
  }, [audioRef.current])
  */
 /* ******* TESTING USECALLBACK ******* */

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      //keyPressPlay
      if(event.key === "p"){
        //cannot read "null", if player is empty
        if(!audioRef.current) return
        if(audioRef.current.paused) audioRef.current.play()
        else audioRef.current.pause()
      }
    })
  }, [audioRef])

  function setupProgressListener(){
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  //amount -> "size" of the slider change, to be converted on time
  function handleSeek(amount: number){
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded(){
    if(hasNext) playNext()
    else clearPlayerState()
  }

  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className={styles.playerContainer}>

      <header>
        <img src="/playing.svg" alt="Now playing" />
        <strong>Now playing...</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Select a podcast to listen</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor: "#04D361"}}
                railStyle={{backgroundColor: "#9F75FF"}}
                handleStyle={{borderColor: "#04D361", borderWidth: 2}}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio id="podcast"
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Randomize" />
          </button>

          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Previous" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Play" />
            ) : (
              <img src="/play.svg" alt="Play" />
            )}
          </button>

          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Next" />
          </button>

          <button
            type="button" 
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repeat" />
          </button>
        </div>
      </footer>
    </div>
  )
}
