import type { ComponentsTree, LoaderContract, LoaderTemplate } from './types.js'

/**
 * Loader implementation for the browser environment. It only allows to register
 * templates in memory and does not support mounting directories or resolving
 * templates from the disk.
 */
export class BrowserLoader implements LoaderContract {
  /**
   * List of pre-registered (in-memory) templates
   */
  #preRegistered: Map<string, LoaderTemplate> = new Map()

  get mounted(): { [key: string]: string } {
    throw new Error('Mounted directories are not available for in-memory loader')
  }

  /**
   * Returns an object of templates registered as a raw string
   *
   * ```js
   * loader.templates
   * // output
   *
   * {
   *   'form.label': { template: 'Template contents' }
   * }
   * ```
   */
  get templates(): { [templatePath: string]: LoaderTemplate } {
    return Array.from(this.#preRegistered).reduce(
      (obj, [key, value]) => {
        obj[key] = value
        return obj
      },
      {} as Record<string, LoaderTemplate>
    )
  }

  mount(_diskName: string, _dirPath: string | URL): void {
    throw new Error(`In-memory loader does not support mounting directories`)
  }

  unmount(_diskName: string): void {
    throw new Error(`In-memory loader does not support unmounting directories`)
  }

  makePath(templatePath: string): string {
    return templatePath
  }

  /**
   * Resolves the template by reading its contents from the disk
   *
   * ```js
   * loader.resolve('welcome', true)
   *
   * // output
   * {
   *   template: `<h1> Template content </h1>`,
   * }
   * ```
   */
  resolve(templatePath: string): LoaderTemplate {
    /**
     * Return from pre-registered one's if exists
     */
    if (this.#preRegistered.has(templatePath)) {
      return this.#preRegistered.get(templatePath)!
    }

    throw new Error(`Cannot resolve "${templatePath}". Make sure the template is registered`)
  }

  /**
   * Register in memory template for a given path. This is super helpful
   * when distributing components.
   *
   * ```js
   * loader.register('welcome', {
   *   template: '<h1> Template content </h1>',
   *   Presenter: class Presenter {
   *     constructor (state) {
   *       this.state = state
   *     }
   *   }
   * })
   * ```
   *
   * @throws Error if template content is empty.
   */
  register(templatePath: string, contents: LoaderTemplate) {
    /**
     * Ensure template content is defined as a string
     */
    if (typeof contents.template !== 'string') {
      throw new Error('Make sure to define the template content as a string')
    }

    /**
     * Do not overwrite existing template with same template path
     */
    if (this.#preRegistered.has(templatePath)) {
      throw new Error(`Cannot override previously registered "${templatePath}" template`)
    }

    this.#preRegistered.set(templatePath, contents)
  }

  /**
   * Remove registered template
   */
  remove(templatePath: string) {
    this.#preRegistered.delete(templatePath)
  }

  listComponents(): ComponentsTree {
    return []
  }
}
