import { useRef, useMemo } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { AppConfig, TurntableHotspot } from '@/types/config'
import { useTurntable } from '@/hooks/useTurntable'
import ExteriorHotspot from './ExteriorHotspot'
import HotspotDetail from './HotspotDetail'
import styles from './ExteriorView.module.css'

interface Props {
  config: AppConfig
}

function buildFrameUrl(config: AppConfig, frame: number): string {
  const { basePath, fileNamePattern, framePadding } = config.turntable
  const padded = String(frame).padStart(framePadding, '0')
  return `${basePath}/${fileNamePattern.replace('{frame}', padded)}`
}

function isHotspotVisible(hotspot: TurntableHotspot, frame: number): boolean {
  const { from, to } = hotspot.visibleOnFrames
  if (from <= to) {
    return frame >= from && frame <= to
  }
  // Wraps around (e.g. from=68, to=30)
  return frame >= from || frame <= to
}

export default function ExteriorView({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentFrame, zoomLevel, activeHotspot, setActiveHotspot } = useAppStore()

  useTurntable(config, containerRef)

  const { turntable } = config
  const visibleHotspots = useMemo(() =>
    turntable.hotspots.filter(h => isHotspotVisible(h, currentFrame)),
    [turntable, currentFrame]
  )

  const currentSrc = buildFrameUrl(config, currentFrame)

  return (
    <div
      ref={containerRef}
      className={styles.container}
      tabIndex={0}
      role="img"
      aria-label={`D328eco aircraft exterior — frame ${currentFrame + 1} of ${turntable.frameCount}. Drag to rotate, scroll to zoom.`}
      style={{ cursor: 'grab' }}
    >
      {/* Aircraft image */}
      <div
        className={styles.imageWrap}
        style={{ transform: `scale(${zoomLevel / turntable.zoom.default})` }}
      >
        <img
          key={currentSrc}
          src={currentSrc}
          alt=""
          className={styles.frame}
          draggable={false}
        />

        {/* Hotspot overlays */}
        {visibleHotspots.map((hotspot) => (
          <ExteriorHotspot
            key={hotspot.headline}
            hotspot={hotspot}
            frame={currentFrame}
            totalFrames={turntable.frameCount}
            verticalOffset={turntable.verticalOffset}
            isActive={activeHotspot?.headline === hotspot.headline}
            onClick={() => setActiveHotspot(
              activeHotspot?.headline === hotspot.headline ? null : hotspot
            )}
          />
        ))}
      </div>

      {/* Detail panel */}
      {activeHotspot && (
        <HotspotDetail
          hotspot={activeHotspot}
          onClose={() => setActiveHotspot(null)}
        />
      )}
    </div>
  )
}
