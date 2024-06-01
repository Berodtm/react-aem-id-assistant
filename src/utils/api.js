// src/utils/api.js
import { logState, logError, logMessage } from '../debug';
import { getDeviceType } from './utils';
import { appBaseUrl, existingAppAssetBaseUrl } from '../constants'; // Import the constants

export const IdApiCheck = async (aemID, setAppBuildUrl, setAppDeployUrl, setAppBuildFolderUrl, setDkpMbrBuildUrl, additionalLiveChecks, setError) => {
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

export const additionalLiveChecks = async (data) => {
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
