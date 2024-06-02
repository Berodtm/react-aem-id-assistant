import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Output from './components/Output';
import Results from './components/Results';
import { resetPage, handleSubmit, copySubID } from './utils/handlers';
import { logState, logError, logMessage } from './debug';
import { assetTypeArray } from './constants';  // Import assetTypeArray here

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

  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`assetType: ${assetType}`);
    } else {
      hasMounted.current = true;
    }
  }, [assetType]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`deviceType: ${deviceType}`);
    }
  }, [deviceType]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`brandType: ${brandType}`);
    }
  }, [brandType]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`appBuildUrl: ${appBuildUrl}`);
    }
  }, [appBuildUrl]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`appBuildFolderUrl: ${appBuildFolderUrl}`);
    }
  }, [appBuildFolderUrl]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`appDeployUrl: ${appDeployUrl}`);
    }
  }, [appDeployUrl]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`dkpMbrBuildUrl: ${dkpMbrBuildUrl}`);
    }
  }, [dkpMbrBuildUrl]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (hasMounted.current) {
      logMessage(`liveCheckResults: ${liveCheckResults}`);
    }
  }, [liveCheckResults]);

  const setStates = {
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
  };

  const handleFormSubmit = () => {
    logMessage('Submit button clicked');
    resetPage(setStates);

    if (aemID.includes(' ')) {
      setError('Error - AEM ID Contains Spaces');
      return;
    }

    try {
      handleSubmit(aemID, setStates, assetTypeArray);  // Pass assetTypeArray here
    } catch (error) {
      logError(error, 'Error during handleSubmit');
      setError('An error occurred');
    }
  };

  return (
    <div className="container">
      <Header />
      <InputForm
        aemID={aemID}
        setAemID={setAemID}
        handleSubmit={handleFormSubmit}
        aemIdSubInput={aemIdSubInput}
        copySubID={() => copySubID(aemIdSubInput)}
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
