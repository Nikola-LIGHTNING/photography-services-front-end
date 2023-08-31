const CracoLessPlugin = require("craco-less"); // Documentation for this plugin https://github.com/DocSpring/craco-less#usage

module.exports = {
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
