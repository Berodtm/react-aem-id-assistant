import React from 'react';

const Header = () => (
  <div className='container'>
    <h1>AEM ID Assistant</h1>
    <p className='description'>
      <strong>ID to Test: </strong>
      core-leads/hal-retail/lins/app/asm/s/tn/rn/cnv/halappasm-test-lead-tile-0224gener1
      <br />
      <strong>API test ID: </strong>
      core-leads/lly-retail/card/app/asm/s/tn/rn/cnv/llyappasm-card-contextual-22droploo1
      <br /> <br />
      Experiment by altering a segment, such as replacing 'dkp' or 'hal' with
      another three-letter string, or by introducing a space.
      <br />
      <br />
      <strong>Using the API</strong>
      <br /> <br />
      For API interactions, please conduct tests within a development Chrome
      instance due to CORS restrictions. Follow these steps to initiate a
      session with disabled security:
      <br />
      <br />
      On Windows: Press the <em>Windows key + R</em> and run the script:{' '}
      <strong>
        "chrome.exe --user-data-dir='C://Chrome dev session'
        --disable-web-security"
      </strong>
      <br />
      On Mac: Enter the following into the terminal:{' '}
      <strong>
        open -na "Google Chrome" --args --user-data-dir='/tmp/Chrome dev
        session' --disable-web-security"
      </strong>{' '}
      <br /> <br />
      <strong>Note:</strong> This method should not be used for regular web
      browsing.
    </p>
  </div>
);

export default Header;
