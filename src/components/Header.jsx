import React from 'react';

const Header = () => (
  <div className="container">
    <h1>AEM ID Assistant</h1>
    <p className="description">
      To evaluate the functionality of the tool, you may use the following sample ID: <strong>core-leads/hal-retail/lins/app/asm/s/tn/rn/cnv/halappasm-test-lead-tile-0224gener1</strong>. Experiment by altering a segment, such as replacing 'dkp' or 'hal' with another three-letter string, or by introducing a space.
      <br /><br />
      For API interactions, please conduct tests within a development Chrome instance due to CORS restrictions. Initiate a session with disabled security by executing: <strong>"chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security"</strong>.(Press the <em>Windows key + R</em> and run the script) Or Enter the following into the MAC terminal: <strong>open -na "Google Chrome" --args --user-data-dir="/tmp/Chrome dev session" --disable-web-security"</strong><br />
      Note: This method should not be used for regular web browsing.<br /><br />
      Sample ID for API functionality: core-leads/lly-retail/card/app/asm/s/tn/rn/cnv/llyappasm-card-contextual-22droploo1
    </p>
  </div>
);

export default Header;
