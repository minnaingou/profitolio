export class User {
  constructor(
    public userId: string,
    public email: string,
    private _token: string,
    private _expirationDate: Date
  ) {}

  get token() {
    if (!this._expirationDate || this._expirationDate < new Date()) {
      // invalid token
      console.error('Invalid token');
      return null;
    } else {
      return this._token;
    }
  }
}
