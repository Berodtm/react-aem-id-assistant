// src/utils/liveCheck.js
import { logState, logError, logMessage } from '../debug';
import { getDeviceType, getBrand, getAssetType, getAemUrls } from './utils';
import { IdApiCheck, additionalLiveChecks } from './api';
import { assetTypeArray } from '../constants'; // Import the constant

export const handleLiveCheck = (aemID, setAppBuildUrl, setAppDeployUrl, setAppBuildFolderUrl, setDkpMbrBuildUrl, setError) => {
  try {
    const { deviceType, deviceTypeStatus } = getDeviceType(aemID);
    logState({ deviceType, deviceTypeStatus }, 'Device Type');
    const assetType = getAssetType(aemID, assetTypeArray);
    logState({ assetType }, 'Asset Type');
    const aemUrls = getAemUrls(aemID, appBaseUrl, deviceType, deviceTypeStatus);
    logState({ aemUrls }, 'AEM URLs');
    const brand = getBrand(aemID);
    logState({ brand }, 'Brand Type');

    setAssetType(`Asset Type: ${assetType.toUpperCase()}`);
    setDeviceType(`Device Type: ${deviceType.toUpperCase()}`);
    setBrandType(`Brand: ${brand.toUpperCase()}`);

    const lastIndex = aemID.lastIndexOf('/');
    if (lastIndex !== -1) {
      setAemIdSubInput(aemID.substring(lastIndex + 1));
      setInputContainerHidden(false);
    }

    if (aemID.includes(' ')) {
      setError('Error - AEM ID Contains Spaces');
    }

    if (
      deviceType === 'app' &&
      brandType !== 'Error - Brand type mismatch' &&
      assetType !== 'Error - Asset type mismatch' &&
      !aemID.includes(' ')
    ) {
      setAppBuildUrl(`AEM APP Direct CF Build Link: ${aemUrls.appBuildUrl}`);
      setAppDeployUrl(`AEM App Deployment Folder Link: ${aemUrls.appDeployUrl}`);
      setAppBuildFolderUrl(`AEM App Build Folder Link: ${aemUrls.appBuildFolderUrl}`);
    } else if (
      (deviceType === 'dkp' || deviceType === 'mbr' || deviceType === 'cwa') &&
      brandType !== 'Error - Brand type mismatch' &&
      assetType !== 'Error - Asset type mismatch' &&
      !aemID.includes(' ')
    ) {
      setDkpMbrBuildUrl(`Desktop, CWA and Mobile Browser direct build AEM link: ${aemUrls.dkpMbrBuildUrl}`);
      setAppBuildFolderUrl(`Desktop, CWA and Mobile Browser AEM folder link: ${aemUrls.dkpMbrBuildUrlFolder}`);
    } else {
      setError('Check AEM ID');
    }

    // Trigger API check
    IdApiCheck(aemID, setAppBuildUrl, setAppDeployUrl, setAppBuildFolderUrl, setDkpMbrBuildUrl, additionalLiveChecks, setError);
  } catch (error) {
    logError(error, 'Error during handleLiveCheck');
    setError('An error occurred');
  }
};
