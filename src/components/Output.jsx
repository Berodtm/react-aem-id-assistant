import React from 'react';

const Output = ({
  assetType,
  deviceType,
  brandType,
  appBuildUrl,
  appBuildFolderUrl,
  appDeployUrl,
  dkpMbrBuildUrl,
  error,
}) => (
  <div className='output form-container'>
    {error && <p id='error' style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
    <p
      id='assetType'
      style={{
        color: assetType && assetType.includes('ERROR') ? 'red' : 'inherit',
        fontWeight: assetType && assetType.includes('ERROR') ? 'bold' : 'inherit',
      }}
    >
      {assetType || ''}
    </p>
    <p
      id='deviceType'
      style={{
        color: deviceType && deviceType.includes('ERROR') ? 'red' : 'inherit',
        fontWeight: deviceType && deviceType.includes('ERROR') ? 'bold' : 'inherit',
      }}
    >
      {deviceType || ''}
    </p>
    <p
      id='brandType'
      style={{
        color: brandType && brandType.includes('ERROR') ? 'red' : 'inherit',
        fontWeight: brandType && brandType.includes('ERROR') ? 'bold' : 'inherit',
      }}
    >
      {brandType || ''}
    </p>
    <p id='appBuildUrl'>
      {appBuildUrl && (
        <>
          AEM APP Direct CF Build Link:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={appBuildUrl.split(' ').pop()}
          >
            Click here
          </a>
        </>
      )}
    </p>
    <p id='appBuildFolderUrl'>
      {appBuildFolderUrl && (
        <>
          AEM App Build Folder Link:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={appBuildFolderUrl.split(' ').pop()}
          >
            Click here
          </a>
        </>
      )}
    </p>
    <p id='appDeployUrl'>
      {appDeployUrl && (
        <>
          AEM App Deployment Folder Link:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={appDeployUrl.split(' ').pop()}
          >
            Click here
          </a>
        </>
      )}
    </p>
    <p id='dkpMbrBuildUrl'>
      {dkpMbrBuildUrl && (
        <>
          Desktop, CWA and Mobile Browser direct build AEM link:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={dkpMbrBuildUrl.split(' ').pop()}
          >
            Click here
          </a>
        </>
      )}
    </p>
  </div>
);

export default Output;
