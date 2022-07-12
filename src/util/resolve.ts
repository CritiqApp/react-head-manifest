import { Manifest, ManifestMeta, PathResolution } from '../types'

/**
 * Resolve the manifest
 * @param manifest the defined manifest
 * @param path the path we are trying to resolve
 * @returns A
 */
export default function resolve(
  manifest: Manifest,
  path: string,
  domainResolver?: string
): { promise: Promise<PathResolution>, controller?: AbortController } {
  const pathSplits = path.split('/').filter((e) => e !== '')

  // If there are paths in the manifest, find the matching path
  if (manifest.paths) {
    const keys = Object.keys(manifest.paths)
    for (var i = 0; i < keys.length; i++) {
      const match = keys[i]
      const matchSplits = match.split('/').filter((e) => e !== '')

      // Determine if the path match
      if (doesPathMatch(pathSplits, matchSplits)) {
        const resolved = manifest.paths[match]

        const vars = resolveVars(pathSplits, matchSplits)

        const result: PathResolution = {
          title: resolved.title
            ? replaceVars(resolved.title, vars)
            : manifest.defaultTitle,
          meta: mergeArrays(
            resolved.meta ? resolved.meta : manifest.defaultMeta,
            manifest.globalMeta
          ).map((e) => replaceMetaVar(e, vars)),
          vars
        }

        // If a resolver is defined for this path, use the network mode
        if (resolved.resolver && domainResolver) {
          const controller = new AbortController()
          const promise = fetch(domainResolver + '?path=' + path, {
            signal: controller.signal,
            method: 'GET',
            cache: 'no-cache'
          }).then((res) => res.json() as Promise<PathResolution>)
          return { promise, controller }
        }
        return {
          promise: new Promise<PathResolution>((resolve) => resolve(result))
        }
      }
    }
  }

  var meta: ManifestMeta[] = mergeArrays(
    manifest.defaultMeta,
    manifest.globalMeta
  )

  return {
    promise: new Promise((resolve) =>
      resolve({
        title: manifest.defaultTitle,
        meta,
        vars: {}
      })
    )
  }
}

/**
 * Determine if the current path matches a manifest path
 * @param path the current path
 * @param match the manifest path to match
 * @returns whether or not the paths match
 */
function doesPathMatch(pathSplits: string[], matchSplits: string[]) {
  for (var i = 0; i < Math.max(pathSplits.length, matchSplits.length); i += 1) {
    const pathSection = pathSplits[i]
    const matchSection = matchSplits[i]

    if (isDefined(matchSection) && matchSection === '*') {
      // If match is wildcard, this passes
      return true
    } else if (!isDefined(pathSection) || !isDefined(matchSection)) {
      // If match is null, this is a fail
      return false
    } else if (matchSection.charAt(0) === ':') {
      // If match has a prefix of `:`, skip this iteration as it's a variable
      continue
    } else if (pathSection !== matchSection) {
      return false
    }
  }
  return true
}

/**
 * Replace variables in a string with their values
 * @param value The string we are inserting variables
 * @param vars the dictionary of variables
 */
function replaceVars(value: string, vars: { [key: string]: string }) {
  Object.keys(vars).forEach((key) => {
    value = value.replaceAll(':' + key, vars[key])
  })
  return value
}

/**
 * Replace the meta strings with vars
 */
function replaceMetaVar(value: ManifestMeta, vars: { [key: string]: string }) {
  var meta: ManifestMeta = {}
  Object.keys(value).forEach((attr) => {
    meta[attr] = replaceVars(value[attr], vars)
  })
  return meta
}

/**
 * Get the variables from a matched path
 * @param pathSplits The splits from the requested path
 * @param matchSplits The splits from the matched path
 * @returns The set of variables
 */
function resolveVars(
  pathSplits: string[],
  matchSplits: string[]
): { [key: string]: string } {
  const vars: { [key: string]: string } = {}
  for (var i = 0; i < matchSplits.length; i++) {
    if (matchSplits[i].charAt(0) === ':') {
      vars[matchSplits[i].substring(1)] = pathSplits[i]
    }
  }
  return vars
}

/**
 * Utility function that determines if a variable
 * is defined (not null or undefined)
 * @param a the variable
 * @returns true if defined, false otherwise
 */
function isDefined(a: any) {
  return a !== null && a !== undefined
}

/**
 * Merge a list of arrays
 * @param args the arrays you want to merge
 * @returns the merged arrays
 */
function mergeArrays<T>(...args: (T | null | undefined)[]) {
  var arr: T[] = []
  args.forEach((e) => {
    if (e) {
      arr = arr.concat(e)
    }
  })
  return arr
}
