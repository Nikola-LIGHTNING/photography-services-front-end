const CracoLessPlugin = require("craco-less");

module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: {
							"@primary-color": "#52c41a",
							"@font-size-base": "16px",
							// "@menu-item-font-size": "16px",
							"@menu-inline-toplevel-item-height": "30px",
							"@menu-item-height": "30px",
						},
						javascriptEnabled: true,
					},
				},
			},
		},
	],
};
