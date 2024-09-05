
export class User {

  private _id: string;
  private _email: string;

  constructor(id: string, email: string) {
    this._id = id
    this._email = email
  }

  id() {
    return this._id
  }

  email() {
    return this._email
  }

}