import React, { useState } from 'react';

const InputForm = ({ aemID, setAemID, handleSubmit, aemIdSubInput, copySubID, inputContainerHidden }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy ID');

  const handleCopyClick = () => {
    copySubID();
    setCopyButtonText('Copied');
    setTimeout(() => setCopyButtonText('Copy ID'), 2000); // Reset text after 2 seconds
  };

  return (
    <div className="input-form">
      <input
        type="text"
        value={aemID}
        onChange={(e) => setAemID(e.target.value)}
        placeholder="Insert AEM ID"
      />
      <div className="button-container">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {!inputContainerHidden && (
        <div className="input-container">
          <input
            type="text"
            id="aemIdSubInput"
            value={aemIdSubInput}
            readOnly
          />
          <button onClick={handleCopyClick}>{copyButtonText}</button>
        </div>
      )}
    </div>
  );
};

export default InputForm;
