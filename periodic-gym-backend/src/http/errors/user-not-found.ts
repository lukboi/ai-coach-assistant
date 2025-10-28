import BaseException from './base-exception'

export default class UserNotFoundException extends BaseException {
  constructor(referenceValue: string) {
    super({
      message: `User ${referenceValue} not found`,
      code: 'USER_NOT_FOUND',
      statusCode: 404,
    })
  }
}
