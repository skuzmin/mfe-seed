import { beforeAll, describe, expect, it } from 'vitest';
import { namespace } from '../src/frontend/config';
import { waitForSelector } from './utils';
import { MfeSeed } from '../src/frontend';

describe('index.ts', () => {
  beforeAll(async () => {
    if (!customElements.get(namespace)) {
      customElements.define(namespace, MfeSeed);
      await customElements.whenDefined(namespace);
    }
  });

  it('should render correctly', async () => {
    // Arrange
    const element = document.createElement(namespace);
    const shadowRoot = element.shadowRoot as ShadowRoot;
    document.body.append(element);

    // Act
    const foundElement = await waitForSelector(shadowRoot, `.${namespace}`);

    // Assert
    expect(foundElement).toBeInstanceOf(Element);
    expect(shadowRoot.innerHTML).toMatchSnapshot();
  });
});
