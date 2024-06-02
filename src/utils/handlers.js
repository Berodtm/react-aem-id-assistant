import { getDeviceType, getBrand, getAssetType, getAemUrls } from './utils';
import { logState, logError, logMessage } from '../debug';
import { appBaseUrl, assetTypeArray } from '../constants';
import { IdApiCheck, additionalLiveChecks } from './api';

export const resetPage = (setStates) => {
  const {
    setAssetType,
    setDeviceType,
    setBrandType,
    setAppBuildUrl,
    setAppBuildFolderUrl,
    setAppDeployUrl,
    setDkpMbrBuildUrl,
    setError,
    setAemIdSubInput,
    setInputContainerHidden,
    setLiveCheckResults,
  } = setStates;

  setAssetType('');
  setDeviceType('');
  setBrandType('');
  setAppBuildUrl('');
  setAppBuildFolderUrl('');
  setAppDeployUrl('');
  setDkpMbrBuildUrl('');
  setError('');
  setAemIdSubInput('');
  setInputContainerHidden(true);
  setLiveCheckResults('');
  logMessage('Page reset');
};

export const handleSubmit = (aemID, setStates, assetTypeArray) => {
    logMessage('Submit button clicked');
    resetPage(setStates);
  
    if (aemID.includes(' ')) {
      setStates.setError('Error - AEM ID Contains Spaces');
      return;
    }
  
    try {
      const { deviceType, deviceTypeStatus } = getDeviceType(aemID);
      logState({ deviceType, deviceTypeStatus }, 'Device Type');
      const assetType = getAssetType(aemID, assetTypeArray);
      logState({ assetType }, 'Asset Type');
      const aemUrls = getAemUrls(aemID, appBaseUrl, deviceType, deviceTypeStatus);
      logState({ aemUrls }, 'AEM URLs');
      const brand = getBrand(aemID);
      logState({ brand }, 'Brand Type');
  
      let errorMessage = '';
  
      if (deviceType === 'Error - Device Type mismatch' || brand === 'Error - Brand type mismatch' || assetType === 'Error - Asset type mismatch') {
        errorMessage = 'Error - Check ID';
      }
  
      setStates.setAssetType(`Asset Type: ${assetType.toUpperCase()}`);
      setStates.setDeviceType(`Device Type: ${deviceType.toUpperCase()}`);
      setStates.setBrandType(`Brand: ${brand.toUpperCase()}`);
      setStates.setError(errorMessage);
  
      const lastIndex = aemID.lastIndexOf('/');
      if (lastIndex !== -1) {
        setStates.setAemIdSubInput(aemID.substring(lastIndex + 1));
        setStates.setInputContainerHidden(false);
      }
  
      if (
        deviceType === 'app' &&
        brand !== 'Error - Brand type mismatch' &&
        assetType !== 'Error - Asset type mismatch' &&
        !aemID.includes(' ')
      ) {
        setStates.setAppBuildUrl(`AEM APP Direct CF Build Link: ${aemUrls.appBuildUrl}`);
        setStates.setAppDeployUrl(`AEM App Deployment Folder Link: ${aemUrls.appDeployUrl}`);
        setStates.setAppBuildFolderUrl(`AEM App Build Folder Link: ${aemUrls.appBuildFolderUrl}`);
      } else if (
        (deviceType === 'dkp' || deviceType === 'mbr' || deviceType === 'cwa') &&
        brand !== 'Error - Brand type mismatch' &&
        assetType !== 'Error - Asset type mismatch' &&
        !aemID.includes(' ')
      ) {
        setStates.setDkpMbrBuildUrl(`Desktop, CWA and Mobile Browser direct build AEM link: ${aemUrls.dkpMbrBuildUrl}`);
        setStates.setAppBuildFolderUrl(`Desktop, CWA and Mobile Browser AEM folder link: ${aemUrls.dkpMbrBuildUrlFolder}`);
      } else {
        setStates.setError('Check AEM ID');
      }
  
      // Trigger API check
      IdApiCheck(aemID, setStates.setAppBuildUrl, setStates.setAppDeployUrl, setStates.setAppBuildFolderUrl, setStates.setDkpMbrBuildUrl, additionalLiveChecks, setStates.setError, setStates.setLiveCheckResults);
    } catch (error) {
      logError(error, 'Error during handleSubmit');
      setStates.setError('An error occurred');
    }
  };
  

export const copySubID = (aemIdSubInput) => {
  if (aemIdSubInput) {
    navigator.clipboard.writeText(aemIdSubInput).then(() => {
      console.log('ID copied to clipboard');
    });
  }
};
