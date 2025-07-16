import type {Locale} from './types.ts';
import {Attribute, Component, Watch} from '../decorators';
import {namespace} from './config';
import {events} from './events.ts';
import {l10n} from '../l10n';
import {Prerender} from './prerender.ts';
import style from './styles/styles.scss?inline';

@Component
class MyAutocomplete extends HTMLElement {
    @Attribute() locale: Locale = 'en_GB';

    private isReady?: boolean;
    private apiAbortController?: AbortController;
    private data?: any;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        events.setHost(this);
        l10n.initialize(this.locale);
        this.isReady = false;
    }

    //#region Init
    async connectedCallback() {
        console.info('connectedCallback');
        await this.init();
        this.render();
        this.isReady = true;
        events.publish().ready(this.setData);
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
            const response = await fetch('https://httpbin.org/get', {
                signal: this.apiAbortController.signal,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            this.data = await response.json();
            console.info('Data loaded', this.data);
        } catch (e: unknown) {
            this.renderFallback();
        }
    }

    setData(text: string): void {
        console.log(text);
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
                <div class="success">${l10n.t('general.success')}</div>
            </div>
        `;
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

customElements.define('my-autocomplete', MyAutocomplete);
