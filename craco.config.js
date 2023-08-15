const CracoLessPlugin = require("craco-less");

module.exports = {
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.(png|jpg|svg|gif)?$/,
	// 			use: {
	// 				loader: 'url-loader',
	// 				options: { sourceMap: true }
	// 			},
	// 		}
	// 	]
	// },
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						javascriptEnabled: true,
					},
				},
			},
		},
	],
};
