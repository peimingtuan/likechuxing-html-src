/**
 * Created by garvey on 2017/6/30.
 */
// loaders
const getLoaders = require('./webpack.loaders')
// plugins
const getPlugins = require('./webpack.plugins')
// optimization
const getOptimization = require('./webpack.optimization')

function getWebpackConfig(project) {

  return {
    entry: project.input_file,
    output: project.output_file,
    module: {
      rules: getLoaders(project)
    },
    plugins: getPlugins(project),
    resolve: {
      extensions: [".ts", ".js", ".jsx", ".json",".vue"],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    optimization: getOptimization(project)
  };

}

module.exports = getWebpackConfig;


