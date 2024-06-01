import React from 'react';

const Output = ({ assetType, deviceType, brandType, appBuildUrl, appBuildFolderUrl, appDeployUrl, dkpMbrBuildUrl, error }) => (
  <div className="output form-container">
    <p id="assetType">{assetType}</p>
    <p id="deviceType">{deviceType}</p>
    <p id="brandType">{brandType}</p>
    <p id="appBuildUrl">
      {appBuildUrl && (
        <>
          AEM APP Direct CF Build Link: <a target="_blank" rel="noopener noreferrer" href={appBuildUrl.split(' ').pop()}>Click here</a>
        </>
      )}
    </p>
    <p id="appBuildFolderUrl">
      {appBuildFolderUrl && (
        <>
          AEM App Build Folder Link: <a target="_blank" rel="noopener noreferrer" href={appBuildFolderUrl.split(' ').pop()}>Click here</a>
        </>
      )}
    </p>
    <p id="appDeployUrl">
      {appDeployUrl && (
        <>
          AEM App Deployment Folder Link: <a target="_blank" rel="noopener noreferrer" href={appDeployUrl.split(' ').pop()}>Click here</a>
        </>
      )}
    </p>
    <p id="dkpMbrBuildUrl">
      {dkpMbrBuildUrl && (
        <>
          Desktop, CWA and Mobile Browser direct build AEM link: <a target="_blank" rel="noopener noreferrer" href={dkpMbrBuildUrl.split(' ').pop()}>Click here</a>
        </>
      )}
    </p>
    <div id="error">{error}</div>
  </div>
);

export default Output;
