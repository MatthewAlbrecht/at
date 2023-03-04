module.exports = {
  plugins: [
    require.resolve('prettier-plugin-astro'),
    'prettier-plugin-tailwindcss',
  ],
  pluginSearchDirs: ['.'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  trailingComma: 'es5',
  semi: false,
  singleQuote: true,
  printWidth: 80,
}
