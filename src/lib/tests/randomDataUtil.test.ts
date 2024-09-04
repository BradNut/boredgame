import { generateRandomAnimalName } from '$lib/utils/randomDataUtil';
import { expect, test } from 'vitest';

test('generateRandomAnimalName', () => {
	expect(generateRandomAnimalName()).not.toBeUndefined();
	expect(generateRandomAnimalName()).not.toEqual(generateRandomAnimalName());
});