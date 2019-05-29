/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-use-before-define */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

const CallWindow = (props) => {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  // Type of the device eg: Video, Audio
  const [deviceType, setDeviceType] = useState({ Video: false, Audio: false });

  const {
    peerSrc, localSrc, status, configs, mediaDevice, endCall,
  } = props;

  useEffect(() => setMediaStream());

  useEffect(() => {
    if (configs) {
      _.forEach(configs, (conf, type) => mediaDevice.toggle(_.capitalize(type), conf));

      setDeviceType({
        Video: configs.video,
        Audio: configs.audio,
      });
    }
  }, [configs, mediaDevice]);

  function setMediaStream() {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  }

  function toggleMediaDevice(thisDeviceType) {
    if (thisDeviceType === 'Video') {
      setDeviceType({
        Video: !deviceType.Video,
        Audio: deviceType.Audio,
      });
    } else {
      setDeviceType({
        Video: deviceType.Video,
        Audio: !deviceType.Audio,
      });
    }
    return mediaDevice.toggle(thisDeviceType);
  }

  function renderControlButtons() {
    const getClass = (icon, type) => classnames(`btn-action fa ${icon}`, {
      disable: !deviceType[type],
    });
    const btns = [
      { type: 'Video', icon: 'fa-video' },
      { type: 'Audio', icon: 'fa-microphone' },
    ];

    return btns.map(btn => (
      <button
        type="button"
        key={`btn${btn.type}`}
        className={getClass(btn.icon, btn.type)}
        onClick={() => toggleMediaDevice(btn.type)}
      />
    ));
  }

  return (
    <div className={classnames('call-window', status)}>
      <video id="peerVideo" ref={peerVideo} autoPlay />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        {renderControlButtons()}
        <button
          type="button"
          className="btn-action hangup fa fa-phone"
          onClick={() => endCall(true)}
        />
      </div>
    </div>
  );
};

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  configs: PropTypes.object, // eslint-disable-line
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
