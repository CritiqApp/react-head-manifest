import FetchManifest from "./util/FetchPathResolution"

export type ManifestMeta = {
  name?: string
  content?: string
} & any

export type ManifestPath = {
  title?: string
  meta?: ManifestMeta[]
  resolver?: string
}

export type Manifest = {
  defaultTitle?: string
  defaultMeta?: ManifestMeta[]
  globalMeta?: ManifestMeta[]
  paths?: { [key: string]: ManifestPath }
}

export type PathResolution = {
  title?: string
  meta: ManifestMeta[]
  vars: { [key: string]: string }
  promise?: FetchManifest
}
