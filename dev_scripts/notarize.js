const { notarize } = require("electron-notarize");
require('dotenv').config()

exports.default = async function notarizing(context) {
  // console.log('context', context)
  return
  const { electronPlatformName, appOutDir } = context;

  console.log(process.env.Apple_Password)

  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  console.log('notorizing')

  await notarize({
    appBundleId: "com.thevoyagingstar.sonic",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.Apple_ID,
    appleIdPassword: process.env.Apple_Password
  });
  console.log('notorize complete')
  return
};
