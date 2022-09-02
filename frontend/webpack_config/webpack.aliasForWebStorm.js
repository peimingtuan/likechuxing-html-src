module.exports = {
  entry: {},
  output: {},
  module: {
    rules: []
  },
  plugins: [],
  resolve: {
    extensions: [".js", ".jsx", ".json", ".vue"],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('other_modules')
    }
  }
}