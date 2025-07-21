export async function waitForSelector(
  root: ParentNode,
  selector: string,
  timeout = 2000,
  interval = 50,
): Promise<Element> {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const element = root.querySelector(selector);
      if (element) return resolve(element);

      if (Date.now() - start >= timeout) {
        return reject(new Error(`Timeout waiting for selector: ${selector}`));
      }

      setTimeout(check, interval);
    };

    check();
  });
}
