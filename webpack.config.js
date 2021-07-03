const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index.js', // Nuestro archivo de entrada
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'), // La carpeta donde se ubicara el dir
    filename: '[name].[contenthash].js', // donde se empacaran nuestros js
    assetModuleFilename: 'assets/images/[hash][ext][query]', // Con esta propiedad generamos el archivo de salida de las imagenes, para que esten en nuestro directorio dir
    clean:true, // Nos limpia el directorio dist de los archivos repetidos por la cantidad de build que hemos echoß
  },
  resolve: {
    extensions: ['.js'], // Extensiones con las que vamos a trabajar
    alias: {
      // Aqui le damores un alias a las rutas de nuestro proyecto
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@templates': path.resolve(__dirname, './src/templates/'),
      '@styles': path.resolve(__dirname, './src/styles/'),
      '@images': path.resolve(__dirname, './src/assets/images/'),
    },
  },
  module: {
    // Donde anadiermos la configuracion de babel
    rules: [
      {
        // Son las reglas que vamos a establecer para los diferentes elementos que habran en el proyecto
        test: /\.m?js$/, // le estamos diciendo cualquier extension js o mjs(modulos)
        exclude: /node_modules/, // excluimos el node_modulos porque no queremos los modulos de node_modules, porque si no nuestra app pudeira romperse
        use: {
          // Aqui le pasarmeos el loader para que pueda entender nuestro codigo js
          loader: 'babel-loader', // nos permite usar babel con webpack
        },
      },
      {
        test: /\.css|.styl$/, // Detectamos archivos css y scss, si queremos detectar otro tipo de css entonces agregamos un pipe desde de css.. por ejempelo css|styl
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'], // Agregamos los loaders de css
      },
      {
        // Esto le agregara un hash a las imagenes
        test: /\.png/, // Esto es para leer las iamgenes png
        type: 'asset/resource', // Es el tipo de recursos que conoce webpack para las imagenes
      },
      {
        test: /\.(woff|woff2)$/, // Agregamos los tipo de fuentes
        use: ['url-loader'], // el loader para los recursos que estan llamando de otra pagina
        type: 'asset/resource',
        generator: {
          // Vamos a generar la salida de las fuentes
          filename: 'assets/fonts/[name].[contenthash].[ext]', // le decimos en que carpeta estaran, le decimos tipo [name] para que respeto el nombre del archivo
        },
      },
    ],
  },
  plugins: [
    // Aqui es donde agregamos las librerias que nos ayuda a transpilar el codigo de nuestro proyecto
    new HTMLWebpackPlugin({
      inject: true, // Inyecta el bundle a nuestro template html
      template: './public/index.html', // Va a tomar nuestro template
      filename: './index.html', // Lo va a poner dentro de nuesta carpeta dist con el nombre de index.html
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
    }),
    // Si tienes la necesidad de mover un archivo o directorio a tu proyecto final podemos usar un plugin llamado “copy-webpack-plugin”
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets/images'), // Especificandole donde estan nuestras imagenes
          to: 'assets/images', // Hacia donde lo moveriamos dentro de nuestro dir
        },
      ],
    }),
    new DotEnv({
      path: path.resolve(__dirname, '.env')
    })
  ],
  optimization: {
    // Esta propiedad noas ayuda a poder optiomizar nuestro codigo css
    minimize: true,
  },
};
