// helpers.js

let exphbsConfig = {
    defaultLayout: 'main',
    helpers: {
        dateCropper: function(date) {
            return String(date).substring(0, 15);
        },
    }
}


export default exphbsConfig;
