module.exports = {
    website: {
        assets: './_assets/',
        js: [
            'document.js'
        ],
        css: [
            'document.css'
        ]
    },
    hooks: {
        finish: function () {
            
        }
    },
    blocks: {
        crumbs: {
            process: function (block) {
                console.log(block)
            }
        }
    }
};