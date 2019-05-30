/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const MainWindow = (props) => {
  const { startCall, clientID } = props;
  const [friendID, setFriendID] = useState(null);
  const [copied, setCopied] = useState(false);
  /**
   * @param {Boolean} video
   */
  function callWithVideo(video) {
    const configs = { audio: true };
    configs.video = video;
    return startCall(true, friendID, configs);
  }
  return (
    <div className="container main-window">
      <div style={{ cursor: 'pointer' }}>
        <CopyToClipboard text={clientID} onCopy={() => setCopied(true)}>
          <h3>
            {!copied ? 'Click to copy your ID:' : 'Copied ID to clipboard:'}
            <input
              type="text"
              disabled
              className="txt-clientId"
              value={clientID}
              style={{ cursor: 'pointer' }}
            />
          </h3>
        </CopyToClipboard>
      </div>
      <h4>Get started by calling a friend below</h4>
      <div>
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Your friend ID"
          onChange={e => setFriendID(e.target.value)}
        />
        <div>
          <button
            className="btn-action fa fa-video"
            onClick={() => callWithVideo(true)}
          />
          <button
            className="btn-action fa fa-phone"
            onClick={() => callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
};

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired,
  clientID: PropTypes.string.isRequired,
};

export default MainWindow;
