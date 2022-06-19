import { Finger } from './Finger';
import { BrowserEnvException } from '../Exception/BrowserEnvExpecption';
import { FingrOptions } from '../Interface/FingrOptions';
import { FingerNotFoundException } from '../Exception/FingerNotFoundException';

import { FingrEvents } from '../Interface/FingrEvents';
import { FingrAbstract } from '../Abstract/FingrAbstract';

export class Fingr extends FingrAbstract {

  protected addFinger(pointerEvent: PointerEvent) {
    const finger = new Finger(pointerEvent);
    this.fingers.push(finger);
    this.addPresenter(finger);
    this.emit(FingrEvents.fingerDown, finger);
  }

  protected updateFinger(pointerEvent: PointerEvent) {
    try {
      const finger = this.getFinger(pointerEvent.pointerId);
      finger.update(pointerEvent);
      this.emit(FingrEvents.fingerMove, finger);
    } catch (err) {
      if (pointerEvent.pointerType === 'mouse' && this.fingers.length === 0) {
        // Mouse is always a moving pointer, so let it go
        return;
      }
      throw err;
    }
  }

  protected removeFinger(pointerEvent: PointerEvent) {
    const finger = this.getFinger(pointerEvent.pointerId);
    finger.update(pointerEvent);
    this.releaseFinger(finger);
    this.removePresenter(finger);
    this.emit(FingrEvents.fingerUp, finger);
  }

  protected getFinger(id: number): Finger {
    const finger = this.fingers.find((finger) => finger.id === id);
    if (!finger) {
      throw new FingerNotFoundException(id);
    }

    return finger;
  }

  protected releaseFinger(finger: Finger) {
    const index = this.fingers.indexOf(finger);
    if (index < 0) {
      return;
    }

    this.fingers.splice(index, 1);
  }

  public start({
    visualFeedback = false,
  }: FingrOptions) {
    if (!document || !window) {
      throw new BrowserEnvException();
    }

    this.options = {
      visualFeedback,
    };

    this.bindEvents();
  }

  public stop() {
    this.releaseEvents();
  }


}