import EventEmitter from 'events';
import { CoordinateInterface } from '../Interface/CoordinateInterface';
import { FingerInterface } from '../Interface/FingerInterface';
import { FingrEvents } from '../Events/FingrEvents';

export class FingerAbstract extends EventEmitter implements FingerInterface {
  id: number;
  position: CoordinateInterface = { x: 0, y: 0 };
  viewportPosition: CoordinateInterface = { x: 0, y: 0 };
  direction: number;
  hovering?: HTMLElement;
  nativeEventsTrace: PointerEvent[] = [];

  constructor(initialPointerEvent: PointerEvent) {
    super();
    this.id = initialPointerEvent.pointerId;
    this.direction = 0;
    this.nativeEventsTrace.unshift(initialPointerEvent);
    this.updateInternals();
  }

  get latestNativeEvent(): PointerEvent {
    return this.nativeEventsTrace[0];
  }

  protected updateInternals() {
    const event = this.nativeEventsTrace[0];
    this.position = {
      x: event.offsetX,
      y: event.offsetY,
    }; 
    this.viewportPosition = {
      x: event.clientX,
      y: event.clientY,
    };
    this.hovering = event.target as HTMLElement;
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