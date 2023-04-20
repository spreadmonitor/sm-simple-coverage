module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    verbose: true
}