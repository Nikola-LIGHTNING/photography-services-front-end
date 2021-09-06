const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            "@primary-color": "#1890ff",
                            "@menu-item-font-size": "16px",
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
