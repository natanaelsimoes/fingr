export class BrowserEnvException extends Error {
  constructor() {
    super('Fingr can only start in a browser environment.');
  }
}