export class FingerNotFoundException extends Error {
  constructor(id: number) {
    super(`Finger '${id}' not found`);
  }
}