/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: webpack.plguins.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-23-16:10
 * Description:
 *
 *************************************************/
const path = require('path')
const Webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const getMetaConfig = require('../template/getMetaConfig')
const getAssets = require('../template/getAssets')
const dll_list = require('../DLLPlugin/dllList')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const argv = require('./parseArgv')

module.exports = function(project){
  let plugins = [
    /** 不管dev or pro 一定会引入的plugin **/

    //每个文件头部增加文本
    new Webpack.BannerPlugin({
      banner:project.getCopyRight(),
      exclude:[/vendor/,/manifest/,/common/]
    }),

    require('autoprefixer'),

    new VueLoaderPlugin(),

    //独立css文件
    new MiniCssExtractPlugin({
      filename: `css/${project.staticDirName}/[name].${project.hash_css}css`,
      //allChunks: true,
      chunkFilename: `css/${project.staticDirName}/chunk.[name].${project.hash_css}css`,
    })
  ]

  // 处理dll的插件
  if (project.dll.length > 0){
    project.dll.forEach(item=>{
      plugins.push(
        new Webpack.DllReferencePlugin({
          manifest:require('../DLLPlugin/dll-bundle-manifest/'+item+'.json'),
          name:item
        })
      )
    })
  }

  //如果需要生成view模板
  if (project.template.manual_list) {
    project.template.manual_list.forEach(item=>{
      let config = {
        template: path.join(__dirname,'../template/index.pug'),
        filename: './' + item.filename + '.html',
        title: item.title,
        meta:getMetaConfig(item.meta),
        appMountId:item.appMountId,
        assets: getAssets(item.assets),
        dll:project.dll.map(item=>{
          let dll = dll_list.find(dll=>dll.name===item)
          let filename =  `dll.${dll.name}.${dll.version}.js`

          if(!project.isProduction){
            return `https://h5test.likechuxing.com/js/bundle/${filename}`
          }else if(project.all_in_html){
            return `https://h5.likechuxing.com/js/bundle/${filename}`
          }else{
            return `/js/bundle/${filename}`
          }
        }),
        inlineSource : '.(js|css)$'
      }

      if (!project.template.importAll) {
        //需要引入的chunk，不配置就会引入所有页面的资源
        config.chunks = ['style', 'vendor', 'chunk','common', item.filename];
      }

      plugins.push(new HtmlWebpackPlugin(config))

      if(project.all_in_html) plugins.push(new HtmlWebpackInlineSourcePlugin())
    })
  }else{
    project.template.list.forEach(item => {
      let config = {
        //favicon路径，通过webpack引入同时可以生成hash值
        //favicon: './src/img/favicon.ico',
        meta:getMetaConfig(['default']),
        // true/'head'/'body'/false
        inject: 'body',
        //我们使用webpack生成hash
        hash: false,
        //生成的html存放路径，相对于path
        filename: './' + item.filename + '.html',
        template: item.path, //html模板路径
        inlineSource : '.(js|css)$'
      }

      if (!project.template.importAll) {
        //需要引入的chunk，不配置就会引入所有页面的资源
        config.chunks = ['style', 'vendor', 'chunk','common', item.filename];
      }

      plugins.push(new HtmlWebpackPlugin(config))

      if(project.all_in_html) plugins.push(new HtmlWebpackInlineSourcePlugin())
    })

    if(project.dll.length>0){
      const dll_list = require('../DLLPlugin/dllList')

      let assets = project.dll.map(item=>{
        let dll = dll_list.find(dll=>dll.name===item)
        return `dll.${dll.name}.${dll.version}.js`
      })

      plugins.push(new HtmlWebpackIncludeAssetsPlugin({
        assets: assets,
        append: false,
        publicPath:project.isProduction ? '/js/bundle/' : 'https://h5test.likechuxing.com/js/bundle/'
      }))
    }
  }

  //区分环境
  if (project.isProduction) {

    plugins.push(
      //标志到生产环境
      new Webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify("production")}})
    );

    // build时删除dist目录下对应项目的文件
    plugins.push(
      new CleanWebpackPlugin(project.output_file.path, {
        // 是否删除项目根目录以外的文件
        allowExternal:true,
        // Write logs to console.
        verbose: false
      })
    )

    // 生成js打包分析
    if(argv.analyze){
      plugins.push(new BundleAnalyzerPlugin({
        analyzerMode:'static',
        openAnalyzer:true,
        reportFilename:'./analyze/report.html'
      }))
    }
  }else{
    plugins.push(new Webpack.HotModuleReplacementPlugin())
    plugins.push(new Webpack.NamedModulesPlugin())
  }

  return plugins
}