/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: webpack.loaders.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-21-18:03
 * Description:
 *
 *************************************************/
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

 module.exports = function (project){
   return [

     // html
     {
       test: /\.html$/,
       loader: 'html-loader'
     },

     // pug
     {
       test: /\.pug$/,
       loader: 'pug-loader'
     },

     // vue
     {
       test: /\.vue$/,
       loader: 'vue-loader'
     },

      // images
     {
       test: /\.(png|jpe?g|svg|gif)$/,
       use: [
         {
           loader: "url-loader",
           options: {
             limit: 8192,
             name: 'images/' + project.staticDirName + '/[name].[ext]'
           }
         },
         {
           loader: 'image-webpack-loader',
           options: {
             mozjpeg: {
               progressive: true,
               quality: 65
             },
             // optipng.enabled: false will disable optipng
             optipng: {
               enabled: false,
             },
             pngquant: {
               quality: '50-65',
               speed: 4
             },
             gifsicle: {
               interlaced: false,
             },
             // the webp option will enable WEBP
             /*webp: {
               quality: 75
             }*/
           }
         }
       ]
     },

     // font
     {
       test: /\.(woff|svg|eot|ttf)\??.*$/,
       use: [
         {
           loader: "url-loader",
           options: {
             name: 'images/' + project.staticDirName + '/[name].[ext]'
           }
         }
       ]
     },

     // typescript
     {
       test: /\.ts$/,
       use:{
         loader:'awesome-typescript-loader'
       }
     },

     // js|jsx
     {
       test: /\.(js|jsx)$/,
       exclude: /node_modules/,
       //include:[/vue-3d-picker/],
       loader: 'babel-loader'
     },

     // less、css
     {
       test: /\.(le|c)ss$/,
       use: [
         project.isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
         //'style-loader',
         {
           loader: 'css-loader',
           options: {minimize: true}
         },
         "postcss-loader",
         "less-loader"
       ]
     }
   ]
 }