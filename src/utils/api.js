import { logState, logError, logMessage } from '../debug';
import { getDeviceType } from './utils';
import { appBaseUrl, existingAppAssetBaseUrl } from '../constants';

export const IdApiCheck = async (aemID, setAppBuildUrl, setAppDeployUrl, setAppBuildFolderUrl, setDkpMbrBuildUrl, additionalLiveChecks, setError, setLiveCheckResults) => {
  logMessage('ID API Check initiated');
  const ids = aemID.split('\n');
  let resultsHTML = '';

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
        resultsHTML += `<div>${id} - <strong><span style="color: red;">ID already published</span></strong><br><a target="_blank" href="https://author-lloydsbg-production.adobecqms.net/editor.html/content/experience-fragments/${id}/master.html">Link to Existing XF Asset in AEM</a><br><a target="_blank" href="${url}">Link to Existing Asset for Non AEM Users</a></div><br>`;
        setAppBuildUrl('');
      } else {
        url = `https://content.lloydsbankinggroup.com/api/assets/${id}.json`;
        const appResponse = await fetch(url);
        if (appResponse.ok) {
          let data = await appResponse.json();
          logState(data, 'API Response Data');

          resultsHTML += `<div>${id} - <strong><span style="color: red;">ID already published</span></strong><br><a target="_blank" href="${existingAppAssetBaseUrl}${id}">Link to Existing App Asset in AEM</a></div><br>`;
          setAppBuildUrl('');
          const additionalResults = await additionalLiveChecks(data);
          resultsHTML += additionalResults;
        } else {
          resultsHTML += `<div>${id} - <strong><span style="color: green;">ID not published</span></strong></div><br>`;
        }
      }
    } catch (error) {
      logError(error, 'Fetch error');
      resultsHTML += `<div>${id} - <span style="color: red;"><strong>Fetch API error - Follow instructions above.</strong></span></div>`;
    }
  }
  logMessage(`Setting liveCheckResults: ${resultsHTML}`);
  setLiveCheckResults(resultsHTML);
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

    let resultsHTML = '<h3>Supporting Live Checks</h3>';

    if (ctaPrimaryText?.value) {
      logMessage('CTA Text found');
      resultsHTML += `<p><strong>CTA text:</strong> ${ctaPrimaryText.value}</p>`;
    }

    if (ctaPrimaryLink?.value) {
      logMessage('CTA URL found');
      resultsHTML += `<p><strong>CTA url:</strong> ${ctaPrimaryLink.value}</p>`;
    }

    if (ctaPrimaryStyle?.value) {
      resultsHTML += `<p><strong>CTA Style:</strong> ${ctaPrimaryStyle.value}</p>`;
    }

    if (titleText?.value) {
      resultsHTML += `<p><strong>Header Text:</strong> ${titleText.value}</p>`;
    }

    if (bodyText?.value) {
      resultsHTML += `<p><strong>Body Text:</strong> ${bodyText.value}</p>`;
    }

    if (style?.value) {
      resultsHTML += `<p><strong>BackGround Style:</strong> ${style.value}</p>`;
    }

    if (imageUrl?.value) {
      resultsHTML += `<p><strong>Image Url:</strong> ${imageUrl.value}</p>`;
    }

    const errorMsg = ctaPrimaryLink?.value?.includes(' ') 
      ? `Common Error Spotted: Spaces in URL: ${ctaPrimaryLink.value}` 
      : `Common Error Check - Pass - URL contains no spaces: ${ctaPrimaryLink.value}`;
    resultsHTML += `<p>${errorMsg}</p>`;

    logMessage(`additionalLiveChecks results: ${resultsHTML}`);
    return resultsHTML;
  } catch (error) {
    logError(error, 'Error in additionalLiveChecks');
    return '';
  }
};
