module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.svelte$': 'svelte-jester'
	},
	extensionsToTreatAsEsm: ['.svelte'],
	testMatch: ['**/*.spec.mjs'],
	moduleFileExtensions: ['js', 'mjs', 'svelte'],
	setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};