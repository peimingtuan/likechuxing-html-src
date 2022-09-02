/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: build-dll.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/7-下午7:21
 Description:
 Param:
 Return:
 *************************************************/
const webpack = require('webpack');
const path = require('path')
const dll_list = require('./DLLPlugin/dllList')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const will_package_dll_names = [
  'like_request'
  //'vconsole',
  //'mint_ui_vue',
  //'react_dom_router_reflux',
  //'jquery',
  /*'vue',
  'vuer',
  'vuex',
  'vueFull',
  'manageOrder',
  'bscroll',
  'like_base'*/
]

let package_list = dll_list.filter(item=>will_package_dll_names.includes(item.name))

let length = package_list.length

const makePackage = function(index){
  if(index < length){

    let current_dll = package_list[index]
    let entry = {}
    entry[current_dll.name] = current_dll.resource

    webpack({
      mode:'production',
      entry,
      output: {
        path: path.join(__dirname, '../dist/bundle/'),
        filename: 'dll.[name].'+current_dll.version+'.js',
        library: '[name]'
      },
      module:{
        rules:[
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify("production")}}),

/*        new webpack.DllReferencePlugin({
          manifest:require('./DLLPlugin/dll-bundle-manifest/'+'vue'+'.json'),
          name:'vue'
        }),*/

        new webpack.DllPlugin({
          path: path.join(__dirname, './DLLPlugin/dll-bundle-manifest', '[name].json'),
          name: '[name]'
        }),

        new BundleAnalyzerPlugin({
          analyzerMode:'static',
          openAnalyzer:true,
          reportFilename:'./analyze/report.html'
        })
      ]
    }, function (err ,stats) {
      if(err){
        throw new Error(err)
      }else{
        process.stdout.write(stats.toString({
          colors: true,
          asserts:true,
          version:false,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
          warnings: false, // 添加警告
          entrypoints: false, // 通过对应的 bundle 显示入口起点
          hash: false, // 添加 compilation 的哈希值
        }) + '\n\n')

        makePackage(++index)
      }
    })
  }
}

makePackage(0)


