import BaseException from './base-exception'

export default class DrizzleException extends BaseException {
  constructor(operation: string, err: string) {
    const message = `Error while doing a ${operation} operation call to the database via Drizzle.`
    if (err) {
      console.log(err)
    }
    super({ message, code: 'DB_CALL' })
  }
}
