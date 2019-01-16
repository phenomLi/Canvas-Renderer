

module.exports = {
    entry: './src/init.ts',
    output: {
		filename: './bundle.js',
		library: 'P2',
     	libraryTarget: 'var'
    },
    resolve: {
		// 先尝试以ts为后缀的TypeScript源码文件
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/, 
				loader: 'awesome-typescript-loader'
			}
		]
	}
};
