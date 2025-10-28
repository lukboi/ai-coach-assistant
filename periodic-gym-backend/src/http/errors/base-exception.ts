interface IBaseException {
  statusCode?: number
  code: string
  message: string
}
export default class BaseException extends Error {
  public statusCode: number
  public code: string
  public message: string

  constructor({ statusCode = 500, code, message }: IBaseException) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.message = message
  }

  toResponse() {
    return Response.json(
      { code: this.code, message: this.message },
      { status: this.statusCode },
    )
  }
}
