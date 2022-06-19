import { CoordinateInterface } from './CoordinateInterface';

export interface FingerInterface {
  id: number;
  position: CoordinateInterface;
  viewportPosition: CoordinateInterface;
  direction: number;
  hovering?: HTMLElement;
  nativeEventsTrace: PointerEvent[];
}