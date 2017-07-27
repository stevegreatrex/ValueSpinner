/// <binding ProjectOpened='Watch - Development' />

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const isDebug = process.env.NODE_ENV === 'development';
const extractLess = new ExtractTextPlugin({ filename: '[name].css' });

const lessConfig = {
	entry: {
		spinner: [
			'page.less',
			'spinner.less'
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'unused.js' //ignored; we care about [name].css above
	},
	resolve: {
		extensions: ['.less', '.css'],
		modules: ['styles']
	},
	module: {
		loaders: [
			{
				test: /\.less$/,
				use: extractLess.extract({
					use: [
						{ loader: 'css-loader', options: { minimize: !isDebug } },
						'less-loader'
					]
				})
			}
		]
	},
	plugins: [
		extractLess,
		new CleanPlugin([
			path.resolve(__dirname, 'dist/*.css'),
			path.resolve(__dirname, 'dist/unused.js')
		])
	]
};

const tsConfig = {
	devtool: 'source-map',
	entry: {
		spinner: 'Spinner.ts'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: 'Spinner',
		libraryTarget: 'amd',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: ['src', 'node_modules']
	},
	module: {
		loaders: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'babel-loader',
						query: { presets: ['es2015'] }
					},
					'awesome-typescript-loader'
				]
			}
		]
	},
	plugins: [
		new CleanPlugin([path.resolve(__dirname, 'dist/*.js')])
	]
};

module.exports = [lessConfig, tsConfig];
