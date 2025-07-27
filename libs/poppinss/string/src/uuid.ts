/*
 * @poppinss/string
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { UUID } from 'node:crypto'

let uuidGenerator: typeof crypto.randomUUID = crypto.randomUUID

/**
 * Generate a UUID v4 string
 */
export function uuid(): UUID {
  return uuidGenerator()
}

/**`
 * Specify a custom method for generating the UUID value
 */
uuid.use = function uuidUse(generator: typeof crypto.randomUUID) {
  uuidGenerator = generator
}
uuid.restore = function uuidRestore() {
  uuidGenerator = crypto.randomUUID
}
