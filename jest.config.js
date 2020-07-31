module.exports = {
	transform: {
		'^.+\\.svelte$': 'svelte-jester'
	},
	moduleFileExtensions: ['js', 'svelte'],
	setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};