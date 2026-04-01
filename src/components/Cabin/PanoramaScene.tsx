import { useEffect, useRef, useCallback, useState } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { AppConfig, CameraHotspot } from '@/types/config'
import CabinNav from './CabinNav'
import CabinHotspot from './CabinHotspot'
import FloorplanMap from './FloorplanMap'
import styles from './PanoramaScene.module.css'

interface Props {
  config: AppConfig
}

export default function PanoramaScene({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<import('@babylonjs/core').Engine | null>(null)
  const sceneRef = useRef<import('@babylonjs/core').Scene | null>(null)
  const domeRef = useRef<import('@babylonjs/core').PhotoDome | null>(null)
  const { activeCameraIndex, isNightMode } = useAppStore()
  const [activeHotspot, setActiveHotspot] = useState<CameraHotspot | null>(null)
  const [isReady, setIsReady] = useState(false)

  const currentCamera = config.cameras[activeCameraIndex]

  // Build sphere image URL based on day/night and size
  const getSphereUrl = useCallback((pathIndex: number, small = false) => {
    const cam = config.cameras[activeCameraIndex]
    const baseName = cam.paths[pathIndex] ?? cam.paths[0]
    if (small) {
      // Use _small variant for initial fast load
      const name = baseName.replace('.webp', '_small.webp')
      return `/sphereImages/${name}`
    }
    return `/sphereImages/${baseName}`
  }, [config.cameras, activeCameraIndex])

  // Initialise Babylon.js engine + scene
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false

    async function init() {
      const { Engine, Scene, HemisphericLight, Vector3, PhotoDome } = await import('@babylonjs/core')

      if (disposed || !canvas) return

      const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true })
      engineRef.current = engine

      const scene = new Scene(engine)
      sceneRef.current = scene
      scene.clearColor = new (await import('@babylonjs/core')).Color4(0.07, 0.07, 0.12, 1)

      // Camera — orbit/look-around camera
      const { ArcRotateCamera } = await import('@babylonjs/core')
      const cam = new ArcRotateCamera('cam', config.initialCamera.horizontal * Math.PI / 180, config.initialCamera.vertical * Math.PI / 180, 0.01, Vector3.Zero(), scene)
      cam.lowerRadiusLimit = 0.01
      cam.upperRadiusLimit = 0.01
      cam.wheelPrecision = 0
      cam.angularSensibilityX = 800
      cam.angularSensibilityY = 800
      cam.panningSensibility = 0
      cam.attachControl(canvas, true)

      // Ambient light
      const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
      light.intensity = 1.2

      // PhotoDome — sphere panorama
      const pathIndex = isNightMode ? 1 : 0
      const dome = new PhotoDome('dome', getSphereUrl(pathIndex), {
        resolution: 32,
        size: 100,
        useDirectMapping: false,
      }, scene)
      domeRef.current = dome

      // Render loop
      engine.runRenderLoop(() => {
        if (!disposed) scene.render()
      })

      // Resize handler
      const onResize = () => engine.resize()
      window.addEventListener('resize', onResize)

      if (!disposed) setIsReady(true)

      return () => {
        disposed = true
        window.removeEventListener('resize', onResize)
        dome.dispose()
        scene.dispose()
        engine.dispose()
      }
    }

    const cleanup = init()
    return () => {
      disposed = true
      cleanup.then(fn => fn?.())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Swap texture when camera or night mode changes
  useEffect(() => {
    if (!domeRef.current || !isReady) return
    const pathIndex = isNightMode ? 1 : 0
    const url = getSphereUrl(pathIndex)
    // Update dome texture
    domeRef.current.photoTexture.updateURL(url)
  }, [activeCameraIndex, isNightMode, isReady, getSphereUrl])

  const hotspots = currentCamera?.hotspots ?? []

  return (
    <div className={styles.scene}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label={`${currentCamera?.name ?? 'Cabin'} 360° panoramic view. Drag to look around.`}
      />

      {/* Camera position navigation */}
      <CabinNav config={config} />

      {/* Interior hotspot markers (positioned over the canvas) */}
      {isReady && hotspots.map((hotspot, i) => (
        <CabinHotspot
          key={i}
          hotspot={hotspot}
          isActive={activeHotspot === hotspot}
          onClick={() => setActiveHotspot(activeHotspot === hotspot ? null : hotspot)}
        />
      ))}

      {/* X-ray floorplan mini-map */}
      <FloorplanMap config={config} />
    </div>
  )
}
