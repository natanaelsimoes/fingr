import EventEmitter from 'events';
import { Finger } from '../Implementation/Finger';
import { FingrEvents } from '../Interface/FingrEvents';
import { FingrOptions } from '../Interface/FingrOptions';
import { FingerPresenter } from '../Presenter/FingerPresenter';

export abstract class FingrAbstract extends EventEmitter {
  protected presenters: FingerPresenter[] = [];
  fingers: Finger[] = [];
  options?: FingrOptions;

  protected bindEvents() {
    window.addEventListener('pointerdown', this.addFinger.bind(this));
    window.addEventListener('pointermove', this.updateFinger.bind(this));
    window.addEventListener('pointerup', this.removeFinger.bind(this));
  }

  protected releaseEvents() {
    window.removeEventListener('pointerdown', this.addFinger.bind(this));
    window.removeEventListener('pointermove', this.updateFinger.bind(this));
    window.removeEventListener('pointerup', this.removeFinger.bind(this));
  }

  protected addPresenter(finger: Finger) {
    if (!this.options?.visualFeedback) {
      return;
    }

    const presenter = new FingerPresenter(finger);
    this.presenters.push(presenter);
  }

  protected removePresenter(finger: Finger) {
    if (!this.options?.visualFeedback) {
      return;
    }

    const index = this.presenters.findIndex((presenter) => {
      return presenter.id === finger.id;
    });

    if (index < 0) {
      return;
    }

    this.presenters.splice(index, 1);
  }

  protected abstract addFinger(pointerEvent: PointerEvent): void;
  protected abstract updateFinger(pointerEvent: PointerEvent): void;
  protected abstract removeFinger(pointerEvent: PointerEvent): void;

  public on<ParamType>(
    eventName: FingrEvents,
    listener: (param: ParamType) => void
  ): this {
    return super.on(eventName, listener);
  }

  public once<ParamType>(
    eventName: FingrEvents,
    listener: (param: ParamType) => void
  ): this {
    return super.once(eventName, listener);
  }

  public off<ParamType>(
    eventName: FingrEvents,
    listener: (param: ParamType) => void
  ): this {
    return super.off(eventName, listener);
  }

  public emit<ParamType>(
    eventName: FingrEvents,
    param: ParamType
  ): boolean {
    return super.emit(eventName, param);
  }

  addListener<ParamType>(
    eventName: FingrEvents,
    listener: (param: ParamType) => void
  ): this {
    return super.addListener(eventName, listener);
  }

  removeAllListeners(event: FingrEvents): this {
    return super.removeAllListeners(event);
  }

  prependListener<ParamType>(
    eventName: FingrEvents,
    listener: (param: ParamType) => void
  ): this {
    return super.prependListener(eventName, listener);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners(eventName: FingrEvents): Function[] {
    return super.listeners(eventName);
  }

  public abstract start(options: FingrOptions): void;
  public abstract stop(): void;
}