export interface DetailView {
  horizontal: number
  vertical: number
  paths: string[]
}

export interface CameraHotspot {
  position: { vertical: number; horizontal: number }
  description: string
  video?: string
  detailView?: DetailView
}

export interface Camera {
  name: string
  position: { x: number; y: number; z: number }
  paths: string[]
  hotspots: CameraHotspot[]
}

export interface Eclipse {
  height: number
  width: number
  offset: { y: number; path: number }
}

export interface TurntableHotspot {
  visibleOnFrames: { from: number; to: number }
  eclipse: Eclipse
  video: string
  headline: string
  icon: string
  hotspotIcon: string
  subheadline?: string
  list: string[]
  disclaim?: string
}

export interface TurntableConfig {
  basePath: string
  fileNamePattern: string
  verticalOffset: number
  frameCount: number
  framePadding: number
  initialFrame: number
  zoom: { default: number; min: number; max: number }
  hotspots: TurntableHotspot[]
}

export interface FloorplanConfig {
  path: string
  width: number
  height: number
  hotspotSize: number
}

export interface GuideConfig {
  initialVisible: boolean
  durationPerSlide: number
  totalDuration: number
}

export interface MorphEffect {
  distance: number
  duration: number
}

export interface FadeEffect {
  duration: number
}

export interface AppConfig {
  debugDome: boolean
  debugNavigation: boolean
  name: string
  initialCameraIndex: number
  interactionGuideVisible: boolean
  guide: GuideConfig
  initialCamera: {
    fov: number
    horizontal: number
    vertical: number
    radius: number
  }
  morphEffect: MorphEffect
  fadeEffect: FadeEffect
  floorplan: FloorplanConfig
  turntable: TurntableConfig
  cameras: Camera[]
}
