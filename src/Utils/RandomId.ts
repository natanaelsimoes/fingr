export class RandomID {
  // eslint-disable-next-line max-len
  static ALLOWED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  static ALLOWED_CHAR_LEN = RandomID.ALLOWED_CHARS.length;

  static generate(length = 10) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += RandomID.ALLOWED_CHARS.charAt(
        Math.floor(Math.random() * RandomID.ALLOWED_CHAR_LEN)
      );
    }
    return result;
  }
}