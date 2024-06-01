import React, { useState } from 'react';
import './style.css';
import { logState, logError, logMessage } from './debug';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Output from './components/Output';
import Results from './components/Results';
import { getDeviceType, getBrand, getAssetType, getAemUrls } from './utils/utils';
import { handleLiveCheck } from './utils/liveCheck';
import { IdApiCheck, additionalLiveChecks } from './utils/api';
import { appBaseUrl, appDeployBaseUrl, appBuildBaseFolder, existingAppAssetBaseUrl, dkpMbrBuildUrlBaseUrl, assetTypeArray } from './constants';

const App = () => {
  const [aemID, setAemID] = useState('');
  const [assetType, setAssetType] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [brandType, setBrandType] = useState('');
  const [appBuildUrl, setAppBuildUrl] = useState('');
  const [appBuildFolderUrl, setAppBuildFolderUrl] = useState('');
  const [appDeployUrl, setAppDeployUrl] = useState('');
  const [dkpMbrBuildUrl, setDkpMbrBuildUrl] = useState('');
  const [error, setError] = useState('');
  const [liveCheckResults, setLiveCheckResults] = useState('');
  const [aemIdSubInput, setAemIdSubInput] = useState('');
  const [inputContainerHidden, setInputContainerHidden] = useState(true);

  const resetPage = () => {
    setAssetType('');
    setDeviceType('');
    setBrandType('');
    setAppBuildUrl('');
    setAppBuildFolderUrl('');
    setAppDeployUrl('');
    setDkpMbrBuildUrl('');
    setError('');
    setInputContainerHidden(true);
    logMessage('Page reset');
  };

  const handleSubmit = () => {
    logMessage('Submit button clicked');
    resetPage();
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
      logError(error, 'Error during handleSubmit');
      setError('An error occurred');
    }
  };

  const copySubID = () => {
    if (aemIdSubInput) {
      navigator.clipboard.writeText(aemIdSubInput).then(() => {
        console.log('ID copied to clipboard');
      });
    }
  };

  return (
    <div className="container">
      <Header />
      <InputForm
        aemID={aemID}
        setAemID={setAemID}
        handleSubmit={handleSubmit}
        aemIdSubInput={aemIdSubInput}
        copySubID={copySubID}
        inputContainerHidden={inputContainerHidden}
      />
      <Output
        assetType={assetType}
        deviceType={deviceType}
        brandType={brandType}
        appBuildUrl={appBuildUrl}
        appBuildFolderUrl={appBuildFolderUrl}
        appDeployUrl={appDeployUrl}
        dkpMbrBuildUrl={dkpMbrBuildUrl}
        error={error}
      />
      <Results liveCheckResults={liveCheckResults} />
    </div>
  );
};

export default App;
