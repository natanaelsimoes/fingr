type SanatizedCSS = Omit<CSSStyleDeclaration, 'length'
  | 'parentRule' | 'getPropertyPriority' | 'getPropertyValue'
  | 'item' | 'removeProperty' | 'setProperty'>;
export type CSSPropertyInterface = keyof SanatizedCSS;