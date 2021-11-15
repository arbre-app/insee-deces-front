export class ErrorTimeout extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ErrorUnavailable extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
