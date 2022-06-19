import { CSSProperty } from '../Interface/CSSProperty';

export class HtmlElement {
  static updateStyle(
    element: HTMLElement,
    style: Partial<CSSStyleDeclaration>
  ) {
    const keys = Object.keys(style) as CSSProperty[];
    for (const key of keys) {
      element.style[key] = style[key] as string;
    }
  }
}