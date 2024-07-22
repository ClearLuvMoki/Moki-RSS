const {version} = require('./package.json')
const {resolve} = require("path")

const isMas = true;
const isMac = true;
const versionArr = version.split('-')
const bundleShortVersion = versionArr[0]
const bundleVersion = versionArr[1]

const config = {
    asar: true,
    productName: 'moki-rss',
    appId: 'cn.moki.rss.desktop',
    directories: {
        output: 'dist'
    },
    icon: resolve(__dirname, "./icons/icon.icns"),
    asarUnpack: "**\\*.{node,dll}",
    files: [
        "./release/dist",
        "node_modules",
        "package.json"
    ],
    mac: {
        icon: resolve(__dirname, "./icons/icon.icns"),
        target: [
            {
                target: 'mas'
            }
        ],
        bundleVersion: bundleVersion,
        bundleShortVersion: bundleShortVersion,
        artifactName: '${productName}-${version}-${arch}.${ext}',
        extendInfo: {
            ElectronTeamID: 'CY8VG8KB97',
            ITSAppUsesNonExemptEncryption: 'NO'
        },
        asarUnpack: [
            '**/*.node',
        ],
    },
    mas: {
        hardenedRuntime: false,
        gatekeeperAssess: false,
        entitlements: 'mas/entitlements.mas.plist',
        entitlementsInherit: 'mas/entitlements.mas.inherit.plist',
        entitlementsLoginHelper: 'mas/entitlements.mas.loginhelper.plist',
        provisioningProfile: 'mas/provisioning.provisionprofile',
    },
    dmg: {
        sign: false
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: false
    },
}
module.exports = config
