import EventEmitter from 'events';
import { Coordinate } from '../Interface/Coordinate';
import { FingrEvents } from '../Interface/FingrEvents';

export class FingerAbstract extends EventEmitter {
  id: number;
  position: Coordinate = { x: 0, y: 0 };
  hovering?: HTMLElement;
  hoverTree: HTMLElement[] = [];
  nativeEventsTrace: PointerEvent[] = [];

  constructor(initialPointerEvent: PointerEvent) {
    super();
    this.id = initialPointerEvent.pointerId;
    this.nativeEventsTrace.unshift(initialPointerEvent);
    this.updateInternals();
  }

  get latestNativeEvent(): PointerEvent {
    return this.nativeEventsTrace[0];
  }

  protected updateInternals() {
    const event = this.nativeEventsTrace[0];

    this.position = {
      x: event.clientX,
      y: event.clientY,
    };

    this.hoverTree = (event as any).path;
    this.hovering = this.hoverTree[0];
  }

  update(pointerEvent: PointerEvent) {
    if (pointerEvent.pointerId !== this.id) {
      // eslint-disable-next-line max-len
      console.warn(`Ignoring update for finger '${this.id}', event belongs to finger '${pointerEvent.pointerId}'`);
      return;
    }

    this.nativeEventsTrace.unshift(pointerEvent);

    if (pointerEvent.type === 'pointerup') {
      delete this.hovering;
      this.emit(FingrEvents.fingerUp);
      return;
    }

    this.updateInternals();
    this.emit(FingrEvents.fingerMove);
  }
}