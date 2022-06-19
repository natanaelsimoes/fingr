type SanatizedCSS = Omit<CSSStyleDeclaration, 'length'
  | 'parentRule' | 'getPropertyPriority' | 'getPropertyValue'
  | 'item' | 'removeProperty' | 'setProperty'>;
export type CSSProperty = keyof SanatizedCSS;