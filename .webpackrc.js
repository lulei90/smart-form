export default {
  entry: 'examples/index.js',
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  html:{
    template: './examples/index.ejs',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
  },
};
