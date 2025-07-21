import { describe, it, beforeAll, expect, vi, afterEach } from 'vitest';
import { ElementsService } from '../../src/frontend/services';

describe('ElementsService', () => {
  let shadowRoot: ShadowRoot;

  beforeAll(() => {
    shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
    ElementsService.init(shadowRoot);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Init', () => {
    it('should initialize and return an instance', () => {
      expect(ElementsService).toBeTruthy();
    });

    it('should return the same instance', () => {
      const createInstance = () => new ElementsService(shadowRoot);

      expect(createInstance).toBeTruthy();
    });

    it('should log an error on second init attempt', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      ElementsService.init(shadowRoot);
      ElementsService.init(shadowRoot);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Singleton: new instance cannot be created!',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Get element', () => {
    it('should get element: ID ', () => {
      const id: string = 'id-1';
      const element = document.createElement('div');
      element.setAttribute('data-id', id);
      shadowRoot.appendChild(element);

      const el = ElementsService.getElement(id);
      expect(el).toBeTruthy();
    });

    it('should get element: ELEMENT ', () => {
      const id: string = 'id-1';
      const element = document.createElement('div');
      element.setAttribute('data-id', id);
      shadowRoot.appendChild(element);

      const el = ElementsService.getElement(element);
      expect(el).toBeTruthy();
    });

    it('should validate missing id/element', () => {
      const el = ElementsService.getElement('non-id');

      expect(el).toBeFalsy();
    });
  });

  describe('Show/Hide element', () => {
    it('should show an element', () => {
      const element = document.createElement('div');
      element.classList.add('hide');
      shadowRoot.appendChild(element);

      ElementsService.showElement(element);
      expect(element.classList.contains('hide')).toBeFalsy();
    });

    it('should show all elements', () => {
      const ids = ['id-1', 'id-2'];
      ids.forEach((id: string) => {
        const el = document.createElement('div');
        el.classList.add('hide');
        el.setAttribute('data-id', id);
        shadowRoot.appendChild(el);
      });

      const spy = vi.spyOn(ElementsService, 'showElement');
      ElementsService.showAllElements(ids);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should hide an element', () => {
      const element = document.createElement('div');
      shadowRoot.appendChild(element);

      ElementsService.hideElement(element);
      expect(element.classList.contains('hide')).toBeTruthy();
    });

    it('should hide all elements', () => {
      const ids = ['id-1', 'id-2'];
      ids.forEach((id: string) => {
        const el = document.createElement('div');
        el.setAttribute('data-id', id);
        shadowRoot.appendChild(el);
      });

      const spy = vi.spyOn(ElementsService, 'hideElement');
      ElementsService.hideAllElements(ids);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Toggle element visibility', () => {
    it('should toggle off (hide) element', () => {
      const element = document.createElement('div');
      shadowRoot.appendChild(element);

      ElementsService.toggleElementVisibility(element);
      expect(element.classList.contains('hide')).toBeTruthy();
    });

    it('should toggle on (show) element', () => {
      const element = document.createElement('div');
      element.classList.add('hide');
      shadowRoot.appendChild(element);

      ElementsService.toggleElementVisibility(element);
      expect(element.classList.contains('hide')).toBeFalsy();
    });

    it('should skip toggling', () => {
      const spyShow = vi.spyOn(ElementsService, 'showElement');
      const spyHide = vi.spyOn(ElementsService, 'hideElement');
      ElementsService.toggleElementVisibility('');

      expect(spyShow).not.toHaveBeenCalled();
      expect(spyHide).not.toHaveBeenCalled();
    });
  });

  describe('Toggle custom class', () => {
    it('should toggle on', () => {
      const element = document.createElement('div');
      shadowRoot.appendChild(element);

      ElementsService.toggleElementClass(element, 'test');
      expect(element.classList.contains('test')).toBeTruthy();
    });

    it('should toggle off', () => {
      const element = document.createElement('div');
      element.classList.add('test');
      shadowRoot.appendChild(element);

      ElementsService.toggleElementClass(element, 'test');
      expect(element.classList.contains('test')).toBeFalsy();
    });

    it('should skip toggling', () => {
      const spyShow = vi.spyOn(ElementsService, 'showElement');
      const spyHide = vi.spyOn(ElementsService, 'hideElement');
      ElementsService.toggleElementClass('', 'test');

      expect(spyShow).not.toHaveBeenCalled();
      expect(spyHide).not.toHaveBeenCalled();
    });
  });

  describe('Error', () => {
    it('should add error class', () => {
      const element = document.createElement('div');
      shadowRoot.appendChild(element);

      ElementsService.addError(element);
      expect(element.classList.contains('error')).toBeTruthy();
    });

    it('should remove error class', () => {
      const element = document.createElement('div');
      element.classList.add('error');
      shadowRoot.appendChild(element);

      ElementsService.removeError(element);
      expect(element.classList.contains('error')).toBeFalsy();
    });
  });

  it('should scroll into view', () => {
    const element = document.createElement('div');
    const testEl = Object.assign(element, {
      scrollIntoView: () => {},
    });
    const spy = vi.spyOn(testEl, 'scrollIntoView');

    ElementsService.scrollIntoView(testEl);
    expect(spy).toHaveBeenCalled();
  });
});
