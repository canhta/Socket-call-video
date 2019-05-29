/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MainWindow = (props) => {
  const { startCall, clientID } = props;
  const [friendID, setFriendID] = useState(null);

  function callWithVideo(video) {
    const configs = { audio: true };
    configs.video = video;
    return startCall(true, friendID, configs);
  }
  return (
    <div className="container main-window">
      <div>
        <h3>
          Hi, your ID is
          <input type="text" disabled className="txt-clientId" value={clientID} />
        </h3>
        <h4>Get started by calling a friend below</h4>
      </div>
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
