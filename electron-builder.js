const {version} = require('./package.json')
const {resolve} = require("path")

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
            "mas"
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
    masDev: {
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
    win: {
        icon: resolve(__dirname, "./icons/icon_512x512@2x.png"),
        target: [
            "nsis"
        ],
        verifyUpdateCodeSignature: false,
        signingHashAlgorithms: [
            "sha256"
        ],
        signDlls: false,
        requestedExecutionLevel: "asInvoker",
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: false,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: "Moki RSS"
    },
}
module.exports = config
