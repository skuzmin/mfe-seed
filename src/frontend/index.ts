import style from './styles/styles.scss?inline';
import type { CatResponse, Locale } from '../types';
import { Attribute, Component, Watch } from '../decorators';
import { namespace } from './config';
import { events } from './events';
import { l10n } from '../l10n';
import { Prerender } from './prerender';
import { ActionIds } from './constants';
import { getCats, ElementsService } from './services';

@Component
export class MfeSeed extends HTMLElement {
  @Attribute() locale: Locale = 'en_GB';

  private isReady?: boolean;
  private apiAbortController?: AbortController;
  private data: Array<CatResponse>;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    events.setHost(this);
    l10n.initialize(this.locale);
    ElementsService.init(this.shadowRoot!);
    this.data = [];
    this.isReady = false;
  }

  //#region Init
  async connectedCallback() {
    await this.init();
    this.render();
    this.initEventListeners();
    this.isReady = true;
    events.publish().ready('MFE ready!');
  }

  async init(): Promise<void> {
    this.renderSkeleton();
    await this.loadData();
  }

  async loadData(): Promise<void> {
    if (this.apiAbortController) {
      this.apiAbortController.abort();
    }
    this.apiAbortController = new AbortController();

    try {
      this.data = await getCats(this.apiAbortController);
      events.publish().loaded(this.data);
    } catch {
      this.renderFallback();
    }
  }

  initEventListeners(): void {
    this.shadowRoot!.addEventListener('click', (e: Event) =>
      this.clickEventHandler(e),
    );
    this.shadowRoot!.addEventListener('keypress', (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.clickEventHandler(e);
      }
    });
  }

  //#endregion

  //#region Render
  renderFallback() {
    this.shadowRoot!.innerHTML = `
        <div class="${namespace}">
          <style>
            ${style}
          </style>
          <div class="fallback-error-message">
            <h2>${l10n.t('general.error')}</h2>
          </div>
        </div>
      `;
  }

  renderSkeleton() {
    this.shadowRoot!.innerHTML = Prerender();
  }

  render(): void {
    this.shadowRoot!.innerHTML = this.template();
  }

  template() {
    return `
        <div class="${namespace}">
            <style>
              ${style}
            </style>
            <h3 class="${namespace}-title">${l10n.t('general.title')}</h3>
            <div class="${namespace}-container">
                <img class="${namespace}-image" src="${this.data[0]?.url}" alt="cat" />
                <button data-action="${ActionIds.AnotherOneBtn}" class="${namespace}-btn">${l10n.t('general.btnText')}</button>
            </div>
        </div>
    `;
  }

  //#endregion

  //#region Event handlers
  clickEventHandler(event: Event): void {
    const { action } = (event.target as HTMLElement).dataset;
    if (!action) {
      return;
    }
    switch (action) {
      case ActionIds.AnotherOneBtn:
        this.getAnotherCat();
        break;
    }
  }

  getAnotherCat(): void {
    this.renderSkeleton();
    this.loadData().then(() => this.render());
  }

  //#endregion

  //#region Watcher
  @Watch('locale')
  updateName(oldValue: string, newValue: string) {
    console.info('updateLocale', oldValue, newValue);
    l10n.initialize(this.locale);
    if (this.isReady) {
      this.render();
    }
  }

  //#endregion
}

if (!customElements.get(namespace)) {
  customElements.define('mfe-seed', MfeSeed);
}

export const prerender = () => Prerender();
