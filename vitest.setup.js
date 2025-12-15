import "vitest-location-mock";
import { beforeAll } from 'vitest';

beforeAll(() => {
  console.debug = () => {};
});

// https://github.com/ant-design/ant-design/issues/21096#issuecomment-732368647
Object.defineProperty(window, 'matchMedia', {
	value: () => {
		return {
			matches: false,
			addListener: () => {},
			removeListener: () => {}
		};
	}
});
