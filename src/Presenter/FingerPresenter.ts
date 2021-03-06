import { FingrEvents } from '../Events/FingrEvents';
import { HtmlElement } from '../Utils/HtmlElement';
import { RandomID } from '../Utils/RandomId';
import { FingerAbstract } from '../Abstract/FingerAbstract';

export class FingerPresenter {
  static BASE_SIZE = 20;
  static BORDER_COLOR = '#f00';
  static BORDER_WIDTH = 4;
  static FULL_SIZE = FingerPresenter.BASE_SIZE + (
    FingerPresenter.BORDER_WIDTH * 2
  );
  static PREFIX = 'fingr-marker-';
  static TEXT_SIZE = 10;
  static TEXT_COLOR = '#000';

  static MARKER_STYLE: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  static CIRCLE_STYLE: Partial<CSSStyleDeclaration> = {
    display: 'block',
    width: `${FingerPresenter.BASE_SIZE}px`,
    height: `${FingerPresenter.BASE_SIZE}px`,
    borderRadius: `${FingerPresenter.BASE_SIZE}px`,
    borderColor: FingerPresenter.BORDER_COLOR,
    borderWidth: `${FingerPresenter.BORDER_WIDTH}px`,
    borderStyle: 'solid',
  };

  static INFO_STYLE: Partial<CSSStyleDeclaration> = {
    marginLeft: `${FingerPresenter.BASE_SIZE / 2}px`,
    color: FingerPresenter.TEXT_COLOR,
    fontSize: `${FingerPresenter.TEXT_SIZE}px`,
  };

  private finger: FingerAbstract;
  private markerId: string;
  private willUnmount = false;

  constructor(finger: FingerAbstract) {
    this.markerId = `${FingerPresenter.PREFIX}${RandomID.generate()}`;
    this.finger = finger;
    this.updatePosition();
    this.finger.on(FingrEvents.fingerMove, this.updatePosition.bind(this));
    this.finger.once(FingrEvents.fingerUp, this.destroy.bind(this));
  }

  get id() {
    return this.finger.id;
  }

  private addInfoRow(table: HTMLElement, label: string, value: any) {
    const infoRow = document.createElement('tr');
    const infoLabel = document.createElement('td');
    infoLabel.innerHTML = label;
    infoLabel.style.textAlign = 'right';
    const equalSign = document.createElement('td');
    equalSign.innerHTML = '=';
    const infoValue = document.createElement('td');
    infoValue.innerHTML = value;
    infoRow.appendChild(infoLabel);
    infoRow.appendChild(equalSign);
    infoRow.appendChild(infoValue);
    table.appendChild(infoRow);
  }

  private getElementIdentification(element?: HTMLElement) {
    if (!element) {
      return 'Unknown';
    }

    const tagName = element.tagName.toLowerCase();
    const selector = element.id ? '#' : (element.className ? '.' : '');
    const identifier = element.id ?? element.className;

    return `${tagName}${selector}${identifier}`;
  }

  private getInfoTable(): HTMLElement {
    const infoTable = document.createElement('table');
    const hovering = this.getElementIdentification(this.finger.hovering);
    this.addInfoRow(infoTable, 'x', this.finger.position.x.toFixed(4));
    this.addInfoRow(infoTable, 'y', this.finger.position.y.toFixed(4));
    this.addInfoRow(infoTable, 'hovering', hovering);
    return infoTable;
  }

  private createFingerMarker(): HTMLElement {
    const fingerMarker = document.createElement('div') as HTMLElement;
    fingerMarker.id = this.markerId;
    HtmlElement.updateStyle(fingerMarker, FingerPresenter.MARKER_STYLE);
    
    const fingerCircle = document.createElement('div') as HTMLElement;
    fingerCircle.dataset.markerType = 'circle';
    HtmlElement.updateStyle(fingerCircle, FingerPresenter.CIRCLE_STYLE);
    
    const fingerInfo = document.createElement('div') as HTMLElement;
    fingerInfo.dataset.markerType = 'info';
    HtmlElement.updateStyle(fingerInfo, FingerPresenter.INFO_STYLE);
    
    fingerMarker.appendChild(fingerCircle);
    fingerMarker.appendChild(fingerInfo);
    document.body.appendChild(fingerMarker);
    
    return fingerMarker;
  }

  private getFingerMarker(): HTMLElement {
    let fingerMarker = document.getElementById(this.markerId) as HTMLElement;
    if (!fingerMarker && !this.willUnmount) {
      fingerMarker = this.createFingerMarker();  
    }
    
    const fingerInfo = fingerMarker.querySelector('[data-marker-type="info"]');
    if (fingerInfo) {
      fingerInfo.innerHTML = this.getInfoTable().outerHTML;
    }

    return fingerMarker;
  }

  private updatePosition(): HTMLElement {
    const fingerMarker = this.getFingerMarker();
    const { x, y } = this.finger.viewportPosition;
    fingerMarker.style.left = `${x - FingerPresenter.FULL_SIZE / 2}px`;
    fingerMarker.style.top = `${y - FingerPresenter.FULL_SIZE / 2}px`;
    return fingerMarker;
  }

  private destroy() {
    this.willUnmount = true;
    this.finger.off(FingrEvents.fingerMove, this.updatePosition.bind(this));
    this.getFingerMarker().remove();
  }
}