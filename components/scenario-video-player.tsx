"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, Maximize, Minimize, Pause, Play, VideoOff } from "lucide-react"

/**
 * Player for scenario videos hosted on Cloudflare R2.
 *
 * Deliberately minimal: a referee watching a scenario should be able to pause,
 * scrub the timeline and go fullscreen, and nothing else. The native control
 * set is off, so there is no volume, playback-rate, picture-in-picture or
 * download affordance to wander into mid-question.
 *
 * Fullscreen takes the wrapper rather than the <video>, so these controls go
 * with it and the referee keeps the same seek bar at full size. iOS Safari
 * cannot fullscreen an arbitrary element, so there it falls back to the
 * video's own native fullscreen.
 *
 * The video autoplays muted (browsers block autoplay with sound) and plays
 * through once. If the browser refuses to autoplay anyway, the centre play
 * button is there.
 */

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/** Safari still carries the prefixed Fullscreen API, desktop and iOS both. */
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => void
}
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => void
}
/** iPhone will only fullscreen the video element itself, not a wrapper. */
type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
}

function fullscreenElement(): Element | null {
  const doc = document as FullscreenDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

interface ScenarioVideoPlayerProps {
  url: string
  className?: string
  /** Skip autoplay — used by the admin preview, where a video that starts
   *  itself while you are typing an answer is a nuisance. */
  autoPlay?: boolean
}

export function ScenarioVideoPlayer({ url, className, autoPlay = true }: ScenarioVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  // While the scrubber is being dragged, timeupdate must not fight the thumb.
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video || hasError) return

    if (video.paused || video.ended) {
      // Replaying a finished video from the end would look like nothing
      // happened, so send it back to the start.
      if (video.ended) video.currentTime = 0
      void video.play().catch(() => {
        /* Autoplay/interaction refusals are surfaced by the play button. */
      })
    } else {
      video.pause()
    }
  }, [hasError])

  // Escape and the browser's own fullscreen chrome both exit without going
  // through the button, so the icon has to follow the document, not the click.
  useEffect(() => {
    const sync = () => setIsFullscreen(fullscreenElement() === containerRef.current)
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync)
    sync()
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current as FullscreenElement | null
    if (!container) return

    if (fullscreenElement()) {
      const doc = document as FullscreenDocument
      if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => {})
      else doc.webkitExitFullscreen?.()
      return
    }

    if (container.requestFullscreen) {
      void container.requestFullscreen().catch(() => {
        /* Refused (permissions policy in an iframe, say) — stay inline. */
      })
      return
    }
    if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen()
      return
    }

    // iOS Safari: the video goes fullscreen on its own and brings the native
    // controls with it, which is the only fullscreen available there.
    ;(videoRef.current as FullscreenVideo | null)?.webkitEnterFullscreen?.()
  }, [])

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  // A fresh src means a fresh video: reset the UI so the previous scenario's
  // duration and progress never show under the new one, then reconcile against
  // whatever the element is actually doing.
  //
  // That second half matters. An autoplaying <video> can start before
  // hydration attaches React's listeners, so the initial onPlay/onLoadedMetadata
  // are simply missed — leaving a play overlay sitting on top of a video that
  // is already running. Reading the element directly closes that gap.
  useEffect(() => {
    setCurrentTime(0)
    setIsScrubbing(false)

    const video = videoRef.current
    if (!video) {
      setIsPlaying(false)
      setDuration(0)
      setIsLoading(true)
      setHasError(false)
      return
    }

    const ready = video.readyState >= 1 // HAVE_METADATA
    setIsPlaying(!video.paused && !video.ended)
    setDuration(ready ? video.duration : 0)
    setCurrentTime(video.currentTime)
    setIsLoading(!ready)
    setHasError(!!video.error)
  }, [url])

  if (!url) {
    return (
      <div
        className={`flex aspect-video items-center justify-center rounded-lg bg-muted ${className || ""}`}
      >
        <p className="text-sm text-muted-foreground">No video for this scenario</p>
      </div>
    )
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black ${
        isFullscreen ? "flex h-full items-center justify-center" : ""
      } ${className || ""}`}
    >
      <video
        ref={videoRef}
        src={url}
        className={`w-full cursor-pointer ${
          isFullscreen ? "h-full object-contain" : "aspect-video"
        }`}
        autoPlay={autoPlay}
        muted
        playsInline
        preload="metadata"
        // No native chrome — the bar below is the entire control surface.
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
          setIsLoading(false)
        }}
        onTimeUpdate={(e) => {
          if (!isScrubbing) setCurrentTime(e.currentTarget.currentTime)
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-center">
          <VideoOff className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">This video could not be loaded</p>
        </div>
      )}

      {isLoading && !hasError && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}

      {/* Centre play button — the way back in after a pause or the end, and the
          fallback when the browser declines to autoplay. */}
      {!isPlaying && !isLoading && !hasError && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 flex cursor-pointer items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-white text-white" />
          </span>
        </button>
      )}

      {/* Controls: play/pause and the timeline. Nothing else by design. */}
      {!hasError && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="shrink-0 cursor-pointer rounded-full p-1 text-white transition-colors hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            disabled={!duration}
            aria-label="Video timeline"
            onPointerDown={() => setIsScrubbing(true)}
            onPointerUp={() => setIsScrubbing(false)}
            onChange={(e) => seekTo(Number(e.target.value))}
            // Rebuild the filled portion of the track from progress, since a
            // range input has no native "played so far" styling.
            style={{
              background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
            }}
            className="h-1 w-full cursor-pointer appearance-none rounded-full outline-none disabled:cursor-default [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />

          <span className="shrink-0 font-mono text-xs tabular-nums text-white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Watch fullscreen"}
            className="shrink-0 cursor-pointer rounded-full p-1 text-white transition-colors hover:bg-white/20"
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
  )
}
