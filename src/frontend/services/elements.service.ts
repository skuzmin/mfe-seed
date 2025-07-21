//index file: ElementsService.init(this.shadowRoot!);

export class ElementsService {
  private readonly shadowRoot: ShadowRoot | undefined;
  private static instance: ElementsService;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
    ElementsService.instance = this;
  }

  public static init(shadowRoot: ShadowRoot): void {
    if (!this.instance) {
      this.instance = new ElementsService(shadowRoot);
    } else {
      console.error('Singleton: new instance cannot be created!');
    }
  }

  public static showElement(data: string | Element): void {
    const el = this.getElement(data);
    if (el) {
      el.classList.remove('hide');
    }
  }

  public static showAllElements(data: Array<string>): void {
    data.forEach((id: string) => {
      const el = this.getElement(id);
      if (el) {
        this.showElement(el);
      }
    });
  }

  public static hideElement(data: string | Element): void {
    const el = this.getElement(data);
    if (el && !el.classList.contains('hide')) {
      el.classList.add('hide');
    }
  }

  public static hideAllElements(data: Array<string>): void {
    data.forEach((id: string) => {
      const el = this.getElement(id);
      if (el) {
        this.hideElement(el);
      }
    });
  }

  public static toggleElementVisibility(data: string | Element): void {
    const el = this.getElement(data);
    if (!el) {
      return;
    }
    if (el.classList.contains('hide')) {
      this.showElement(el);
    } else {
      this.hideElement(el);
    }
  }

  public static toggleElementClass(
    data: string | Element,
    className: string,
  ): void {
    const el = this.getElement(data);
    if (!el) {
      return;
    }
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    } else {
      el.classList.add(className);
    }
  }

  public static scrollIntoView(data: string | Element): void {
    const el = this.getElement(data);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public static addError(data: string | Element): void {
    const el = this.getElement(data);
    if (el && !el.classList.contains('error')) {
      el.classList.add('error');
    }
  }

  public static removeError(data: string | Element): void {
    const el = this.getElement(data);
    if (el) {
      el.classList.remove('error');
    }
  }

  public static getElement(data: string | Element): Element | undefined {
    const el =
      typeof data === 'string'
        ? this.instance.shadowRoot!.querySelector(`[data-id="${data}"]`)
        : data;
    if (!el) {
      console.warn(`data-id is wrong or element is missing: `, data);
      return undefined;
    } else {
      return el;
    }
  }
}
