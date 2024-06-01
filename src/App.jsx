import React, { useState } from 'react';
import './style.css';
import { logState, logError, logMessage } from './debug';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Output from './components/Output';
import Results from './components/Results';
import { getDeviceType, getBrand, getAssetType, getAemUrls } from './utils';

const appBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/mnt/overlay/dam/cfm/admin/content/v2/createfragment.html/content/dam/';
const appDeployBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/aem/experience-fragments.html/content/experience-fragments/';
const appBuildBaseFolder = 'https://author-lloydsbg-production.adobecqms.net/assets.html/content/dam/';
const existingAppAssetBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/editor.html/content/dam/';
const dkpMbrBuildUrlBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/mnt/overlay/cq/experience-fragments/content/v2/experience-fragments/createxfwizard.html/content/experience-fragments/';
const assetTypeArray = ['bpt', 'asm', 'til', 'lnk', 'stk', 'dpp', 'eal', 'lob', 'mrc', 'nvt', 'phl', 'pom', 'vpd', 'mam', 'aev', 'sfw', 'gam', 'afw'];

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
      IdApiCheck();
    } catch (error) {
      logError(error, 'Error during handleSubmit');
      setError('An error occurred');
    }
  };

  const copySubID = () => {
    if (aemIdSubInput) {
      navigator.clipboard.writeText(aemIdSubInput).then(() => {
        console.log('ID copied to clipboard')
        
      });
    }
  };

  const IdApiCheck = async () => {
    logMessage('ID API Check initiated');
    const ids = aemID.split('\n');
    const resultsContainer = document.getElementById('live-check-results');
    resultsContainer.innerHTML = '';
    for (let id of ids) {
      if (id.trim() === '') continue;
      let { deviceType, deviceTypeStatus } = getDeviceType(id);
      let url;
      if (deviceType === 'dkp' || deviceType === 'mbr' || deviceType === 'cwa') {
        url = `https://content.lloydsbankinggroup.com/content/experience-fragments/${id}/master.html`;
      } else {
        url = `https://content.lloydsbankinggroup.com/api/assets/${id}.json`;
      }
      try {
        logMessage(`Fetching URL: ${url}`);
        const response = await fetch(url);
        if (
          response.ok &&
          (deviceType === 'dkp' || deviceType === 'mbr' || deviceType === 'cwa')
        ) {
          resultsContainer.innerHTML += `<div>${id} - <strong><span style="color: red;">ID already published</span></strong><br><a target="_blank" href="https://author-lloydsbg-production.adobecqms.net/editor.html/content/experience-fragments/${id}/master.html">Link to Existing XF Asset in AEM</a><br><a target="_blank" href="${url}">Link to Existing Asset for Non AEM Users</a></div><br>`;
          setAppBuildUrl('');
        } else {
          url = `https://content.lloydsbankinggroup.com/api/assets/${id}.json`;
          const appResponse = await fetch(url);
          if (appResponse.ok) {
            let data = await appResponse.json();
            logState(data, 'API Response Data');

            resultsContainer.innerHTML += `<div>${id} - <strong><span style="color: red;">ID already published</span></strong><br><a target="_blank" href="${existingAppAssetBaseUrl}${id}">Link to Existing App Asset in AEM</a></div><br>`;
            setAppBuildUrl('');
            await additionalLiveChecks(data);
          } else {
            resultsContainer.innerHTML += `<div>${id} - <strong><span style="color: green;">ID not published</span></strong></div><br>`;
          }
        }
      } catch (error) {
        logError(error, 'Fetch error');
        resultsContainer.innerHTML += `<div>${id} - <span style="color: red;"><strong>Fetch API error - Follow instructions above.</strong></span></div>`;
      }
    }
  };

  const additionalLiveChecks = async (data) => {
    try {
      const ctaPrimaryText = data?.properties?.elements?.ctaPrimaryText || null;
      const ctaPrimaryLink = data?.properties?.elements?.ctaPrimaryLink || null;
      const ctaPrimaryStyle = data?.properties?.elements?.ctaPrimaryStyle || null;
      const titleText = data?.properties?.elements?.titleText || null;
      const bodyText = data?.properties?.elements?.bodyText || null;
      const style = data?.properties?.elements?.style || null;
      const imageUrl = data?.properties?.elements?.imageUrl || null;

      const resultsContainer = document.getElementById('live-check-results');

      const h3 = document.createElement('h3');
      h3.textContent = 'Supporting Live Checks';
      resultsContainer.appendChild(h3);

      if (ctaPrimaryText?.value) {
        logMessage('CTA Text found');
        const ctaText = document.createElement('p');
        ctaText.innerHTML = `<strong>CTA text:</strong> ${ctaPrimaryText.value}`;
        resultsContainer.appendChild(ctaText);
      }

      if (ctaPrimaryLink?.value) {
        logMessage('CTA URL found');
        const ctaURL = document.createElement('p');
        ctaURL.innerHTML = `<strong>CTA url:</strong> ${ctaPrimaryLink.value}`;
        resultsContainer.appendChild(ctaURL);
      }

      if (ctaPrimaryStyle?.value) {
        const ctaStyle = document.createElement('p');
        ctaStyle.innerHTML = `<strong>CTA Style:</strong> ${ctaPrimaryStyle.value}`;
        resultsContainer.appendChild(ctaStyle);
      }

      if (titleText?.value) {
        const header = document.createElement('p');
        header.innerHTML = `<strong>Header Text:</strong> ${titleText.value}`;
        resultsContainer.appendChild(header);
      }

      if (bodyText?.value) {
        const bodyCopy = document.createElement('p');
        bodyCopy.innerHTML = `<strong>Body Text:</strong> ${bodyText.value}`;
        resultsContainer.appendChild(bodyCopy);
      }

      if (style?.value) {
        const backgroundStyle = document.createElement('p');
        backgroundStyle.innerHTML = `<strong>BackGround Style:</strong> ${style.value}`;
        resultsContainer.appendChild(backgroundStyle);
      }

      if (imageUrl?.value) {
        const image = document.createElement('p');
        image.innerHTML = `<strong>Image Url:</strong> ${imageUrl.value}`;
        resultsContainer.appendChild(image);
      }

      const p = document.createElement('p');
      resultsContainer.appendChild(p);

      if (ctaPrimaryLink?.value) {
        const pSpaceCheck = document.createElement('p');

        if (ctaPrimaryLink.value.includes(' ')) {
          logMessage('Failed QA: Spaces in URL');
          pSpaceCheck.textContent =
            'Common Error Spotted: Spaces in URL: ' + ctaPrimaryLink.value;
        } else {
          logMessage('URL contains no spaces');
          pSpaceCheck.textContent =
            'Common Error Check - Pass - URL contains no spaces: ';
        }

        resultsContainer.appendChild(pSpaceCheck);
      }
    } catch (error) {
      logError(error, 'Error in additionalLiveChecks');
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
