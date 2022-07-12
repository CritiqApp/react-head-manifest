import React from 'react'
import { useLocation } from 'react-router-dom'
import { Manifest, ManifestMeta, PathResolution } from './types'
import resolve from './util/resolve'

/**
 * Hook that will handle all the head manifest logic
 * in a React project. Just plug and play!
 * @param manifest The loaded manifest file
 * @param domainResolver Where to fetch path results that require a resolver
 */
export default function useHeadManifest(
  manifest: Manifest | null,
  domainResolver?: string
) {
  const location = useLocation()
  const [resolvedPath, setResolvedPath] = React.useState<PathResolution>()

  // This effect will resolve location
  React.useEffect(() => {
    if (manifest) {
      const resolved = resolve(manifest, location.pathname, domainResolver)
      resolved.promise.then(setResolvedPath)
      return () => resolved.controller && resolved.controller?.abort()
    }
    return undefined
  }, [location, manifest])

  // This effect takes new resolvedPaths
  React.useEffect(() => {
    const tags: HTMLElement[] = []
    if (resolvedPath) {
      // Build the title element
      if (resolvedPath.title) {
        document.title = resolvedPath.title
      }

      // Build the meta elements
      resolvedPath.meta.forEach((meta: ManifestMeta) => {
        const tag = document.createElement('meta')
        Object.keys(meta).forEach((key) => {
          tag[key] = meta[key]
        })
        tags.push(tag)
      })

      // Append the tags
      tags.forEach((tag) => document.head.appendChild(tag))
    }

    // Return a callback which will remove all these tags
    return () => tags.forEach((tag) => document.head.removeChild(tag))
  }, [resolvedPath])
}
