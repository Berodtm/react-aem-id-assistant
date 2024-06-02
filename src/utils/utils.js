// utils.js

const productCodes = ['lins', 'invs'];
const appBuildBaseFolder = 'https://author-lloydsbg-production.adobecqms.net/assets.html/content/dam/';
const appDeployBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/aem/experience-fragments.html/content/experience-fragments/';
const dkpMbrBuildUrlBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/mnt/overlay/cq/experience-fragments/content/v2/experience-fragments/createxfwizard.html/content/experience-fragments/';
const existingAppAssetBaseUrl = 'https://author-lloydsbg-production.adobecqms.net/editor.html/content/dam/';

export function getDeviceType(aemID) {
  let deviceType = '';
  let deviceTypeStatus = false;
  if (
    (aemID.includes('app') && aemID.includes('dkp')) ||
    (aemID.includes('app') && aemID.includes('mbr')) ||
    (aemID.includes('dkp') && aemID.includes('mbr')) ||
    (aemID.includes('cwa') && aemID.includes('mbr')) ||
    (aemID.includes('cwa') && aemID.includes('dkp')) ||
    (aemID.includes('cwa') && aemID.includes('app'))
  ) {
    deviceType = 'Error - Device Type mismatch';
  } else if (aemID.includes('app')) {
    deviceType = 'app';
    deviceTypeStatus = true;
  } else if (aemID.includes('dkp')) {
    deviceType = 'dkp';
    deviceTypeStatus = true;
  } else if (aemID.includes('mbr')) {
    deviceType = 'mbr';
    deviceTypeStatus = true;
  } else if (aemID.includes('cwa')) {
    deviceType = 'cwa';
    deviceTypeStatus = true;
  } else {
    deviceType = 'error';
  }
  return { deviceType, deviceTypeStatus };
}

export function getBrand(aemID) {
  let brandType = '';
  if (
    (aemID.includes('lly') && aemID.includes('bos')) ||
    (aemID.includes('lly') && aemID.includes('hal')) ||
    (aemID.includes('hal') && aemID.includes('bos')) ||
    (aemID.includes('mbn') && aemID.includes('bos')) ||
    (aemID.includes('mbn') && aemID.includes('hal')) ||
    (aemID.includes('mbn') && aemID.includes('lly'))
  ) {
    brandType = 'Error - Brand type mismatch';
  } else if (aemID.includes('lly')) {
    brandType = 'lly';
  } else if (aemID.includes('hal')) {
    brandType = 'hal';
  } else if (aemID.includes('bos')) {
    brandType = 'bos';
  } else if (aemID.includes('mbn')) {
    brandType = 'mbn';
  }
  return brandType;
}

export function getAssetType(aemID, assetTypeArray) {
  // Initialize variables to hold the final asset type and the count of asset types found
  let assetType = '';
  let assetTypeCount = 0;

  // Use a regular expression to match any asset types in the string 'aemID'
  // The regular expression is created by joining all elements in 'assetTypeArray' with '|', 
  // which means "or" in regex, and adding the 'g' flag for global search
  const regex = new RegExp(assetTypeArray.join('|'), 'g');
  // Apply the regular expression to the 'aemID' string to find all matches
  const matches = aemID.match(regex);

  // Check if any matches were found
  if (matches) {
    // Count the number of matches found
    assetTypeCount = matches.length;
    // Create a Set from the matches to get unique asset types
    const uniqueAssetTypes = new Set(matches);

    // If more than one unique asset type is found, indicate a mismatch error
    if (uniqueAssetTypes.size > 1) {
      assetType = 'Error - Asset type mismatch';
    // If exactly one unique asset type is found, set 'assetType' to that type
    } else if (uniqueAssetTypes.size === 1) {
      assetType = [...uniqueAssetTypes][0]; // Convert the Set to an array and get the first element
    }
  } else {
    // If no matches are found, indicate no valid asset type found
    assetType = 'Error - No valid asset type found';
  }

  // Log the number of asset types found and the final asset type
  console.log(`Asset types found: ${assetTypeCount}, Asset type: ${assetType}`);
  // Return the final asset type
  return assetType;
}


export function getAemUrls(aemID, appBaseUrl, deviceType, deviceTypeStatus) {
  const index = aemID.indexOf('core-leads');
  const lastIndex = aemID.lastIndexOf('/');
  const id = aemID.slice(index, lastIndex);
  let result = {};

  if (!(aemID.includes('core-leads') && aemID.includes('retail'))) {
    let errorElement = document.createElement('p');
    let aemIdErrorTextElement = document.getElementById('error');
    errorElement.innerText =
      "Error: ID does not contain 'core-leads' and 'retail'";
    errorElement.style.color = 'red';
    errorElement.style.fontWeight = 'bold';
    errorElement.style.textAlign = 'center';
    aemIdErrorTextElement.appendChild(errorElement);
    throw new Error('Invalid AEM ID');
  }

  if (deviceType === 'app' && deviceTypeStatus === true) {
    const appBuildUrl = appBaseUrl + id;
    result.appBuildUrl = appBuildUrl;
    const appBuildFolderUrl = appBuildBaseFolder + id;
    result.appBuildFolderUrl = appBuildFolderUrl;

    const appDeployUrl = appDeployBaseUrl + id;
    result.appDeployUrl = appDeployUrl;
  } else if (deviceTypeStatus === true) {
    const dkpMbrBuildUrl = dkpMbrBuildUrlBaseUrl + id;
    result.dkpMbrBuildUrl = dkpMbrBuildUrl;

    const dkpMbrBuildUrlFolder = appDeployBaseUrl + id;
    result.dkpMbrBuildUrlFolder = dkpMbrBuildUrlFolder;
  }
  return result;
}
