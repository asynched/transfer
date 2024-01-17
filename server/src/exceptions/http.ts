export class HttpException extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
  }

  intoResponse() {
    return new Response(
      JSON.stringify({
        message: this.message,
        data: this.data,
        status: this.status,
      }),
      {
        status: this.status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
