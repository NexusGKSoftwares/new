// postcss.config.cjs
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead', 'Chrome >= 60', 'Firefox >= 60', 'Safari >= 10'],
    }),
    require('postcss-preset-env')({
      stage: 3,  // Allows you to use future CSS features
    }),
  ],
}
