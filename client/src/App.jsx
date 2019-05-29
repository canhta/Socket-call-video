/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import './css/app.scss';

import _ from 'lodash';
import socket from './utils/socket';
import PeerConnection from './utils/PeerConnection';
import MainWindowComponent from './components/MainWindow';
import CallWindowComponent from './components/CallWindow';
import CallModalComponent from './components/CallModal';

function App() {
  const peer = useRef({});
  const configs = useRef(null);

  const [clientID, setClientID] = useState('');
  const [callWindow, setCallWindow] = useState('');
  const [callModal, setCallModal] = useState('');
  const [callFrom, setCallFrom] = useState('');
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);

  useEffect(() => {
    console.log('Did Mount');
    socket
      .on('init', data => setClientID(data.id))
      .on('request', (data) => {
        setCallModal('active');
        setCallFrom(data.from);
      })
      .on('call', (data) => {
        if (data.sdp) {
          peer.current.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') peer.current.createAnswer();
        } else peer.current.addIceCandidate(data.candidate);
      })
      .on('end', endCall(false))
      .emit('init');
  }, []);

  function startCall(isCaller, friendID, config) {
    configs.current = config;
    peer.current = new PeerConnection(friendID)
      .on('localStream', (src) => {
        setCallWindow('active');
        setLocalSrc(src);
        if (!isCaller) {
          setCallModal('');
        }
      })
      .on('peerStream', src => setPeerSrc(src))
      .start(isCaller, config);
  }

  function rejectCall() {
    socket.emit('end', { to: callFrom });
    setCallModal('');
  }

  function endCall(isStarter) {
    if (_.isFunction(peer.current.stop)) peer.current.stop(isStarter);
    peer.current = {};
    configs.current = null;

    setCallWindow('');
    setLocalSrc(null);
    setPeerSrc(null);
  }

  return (
    <div>
      <MainWindowComponent clientID={clientID} startCall={startCall} />
      <CallWindowComponent
        status={callWindow}
        localSrc={localSrc}
        peerSrc={peerSrc}
        configs={configs.current}
        mediaDevice={peer.current.mediaDevice}
        endCall={endCall}
      />
      <CallModalComponent
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
    </div>
  );
}

export default App;
