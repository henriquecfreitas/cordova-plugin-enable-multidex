module.exports = function(context) {
    var fs = require('fs')
    var path = require('path')
    var xml = require('cordova-common').xmlHelpers

    var platformRoot = path.join(context.opts.projectRoot, './platforms/android')

    var filepaths = [
        path.join(platformRoot, './app/src/main/AndroidManifest.xml'),
    ]

    var filepath = filepaths.find(function(filepath) {
        try {
            fs.accessSync(filepath, fs.constants.F_OK)
            return true
        } catch (err) {
            return false
        }
    })

    var doc

    return new Promise(resolve, reject => {
        if (filepath != null) {
            doc = xml.parseElementtreeSync(filepath)
            doc.getroot().find('./application').attrib['android:name'] =
            'androidx.multidex.MultiDexApplication'
            fs.writeFileSync(filepath, doc.write({ indent: 4 }))
            resolve()
        } else {
            reject(new Error("Can't find AndroidManifest.xml"))
        }
    });
}
