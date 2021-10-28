import { PathResolution } from "../types"

export default class FetchPathResolution {
  private controller: AbortController
  private promise: Promise<PathResolution>

  constructor(url: string, path: string) {
    this.controller = new AbortController()
    this.promise = fetch(url + '?path=' + path, {
      signal: this.controller.signal,
      method: 'GET',
      cache: 'no-cache'
    }).then((res) => res.json() as Promise<PathResolution>)
  }

  public then(callback: (manifest: PathResolution) => void) {
    return this.promise.then(callback)
  }

  public catch(callback: () => void) {
    return this.promise.catch(callback)
  }

  public cancel() {
    this.catch(() => {}) // Supress warnings in console
    this.controller.abort()
  }
}
