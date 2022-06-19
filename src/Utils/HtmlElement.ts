import { CSSPropertyInterface } from '../Interface/CSSPropertyInterface';

export class HtmlElement {
  static updateStyle(
    element: HTMLElement,
    style: Partial<CSSStyleDeclaration>
  ) {
    const keys = Object.keys(style) as CSSPropertyInterface[];
    for (const key of keys) {
      element.style[key] = style[key] as string;
    }
  }
}