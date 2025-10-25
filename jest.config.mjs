export default {
  // Le dice a Jest que el entorno de prueba es Node.js 
  testEnvironment: 'node',
  // Desactiva la transformación de archivos
  transform: {},
  // Reescribe las importaciones para que Jest entienda los módulos ES
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  collectCoverage: true,
  /// Incluir todos los .js 
  collectCoverageFrom: [
    '**/*.js',
    '!**/__tests__/**',
    '!**/*.test.js',
    '!**/*.spec.js',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.mjs',
    '!config/swagger*'
  ],
  coverageDirectory: 'coverage'
};