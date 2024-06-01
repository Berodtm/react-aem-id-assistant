import React from 'react';

const Results = ({ liveCheckResults }) => (
  <div id="live-check-results" dangerouslySetInnerHTML={{ __html: liveCheckResults }}></div>
);

export default Results;
