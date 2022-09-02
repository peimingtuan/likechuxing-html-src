/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: webpack.optimization.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-23-16:22
 * Description:
 *
 *************************************************/
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

 module.exports = function(project){

   if(!project.isProduction)return {}

   let optimization = {
     minimizer: [
       // js mini
       new UglifyJsPlugin(/*{
         cache: false,
         parallel: true,
         sourceMap: false, // set to true if you want JS source maps
         uglifyOptions: {
           warnings: false,
           parse: {},
           compress: {},
           mangle: {
             toplevel:true,
             properties:{}
           },
           output: {
             comments:/(copyright ©|license)/i
           },
           toplevel: false,
           nameCache: null,
           ie8: false,
           keep_fnames: false
         }
       }*/),
       // css mini
       new OptimizeCSSPlugin({})
     ]
   }

   if (project.bundle_vendor) {

     let cacheGroup = {
       /*default: {
         minChunks: 2,
         priority: -20,
         test:/[^(le|c)ss]$/,
         reuseExistingChunk: true,
       },*/
       default:false,
       common:{
         minChunks: 2,
         name:'common',
         priority: 5
       },
       vendors: {
         name: 'vendor',
         test: /[\\/]node_modules[\\/]/,
         priority: 10
       }
     }

     // 入口文件多余1个才给style分包
     /*if(Object.keys(project.input_file).length>1){
       cacheGroup.styles = {
         priority: 20,
         name:'style',
         test: /\.(sa|le|s?c)ss$/,
         chunks:'all',
         enforce:true
       }
     }*/

     optimization.splitChunks = {
       chunks: 'all',
       // 大于30KB才单独分离成chunk
       minSize: 30000,
       maxAsyncRequests: 5,
       maxInitialRequests: 3,
       name: true,
       cacheGroups: cacheGroup
     }

     /*optimization.runtimeChunk = {
       name: "manifest"
     }*/
   }

   return optimization
 }
