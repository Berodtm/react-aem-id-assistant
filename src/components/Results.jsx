import React, { useEffect } from 'react';
import { logMessage } from '../debug';

const Results = ({ liveCheckResults }) => {
  useEffect(() => {
    logMessage(`Rendering Results: ${liveCheckResults}`);
  }, [liveCheckResults]);

  return (
    <div className='results'>
      {liveCheckResults ? (
        <div dangerouslySetInnerHTML={{ __html: liveCheckResults }} />
      ) : (
        <p>No results to display.</p>
      )}
    </div>
  );
};

export default Results;
