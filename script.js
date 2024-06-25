const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const callPeerButton = document.getElementById('callPeer');
const peerIdInput = document.getElementById('peerId');

let localStream;
let peer;
let call;

startCallButton.addEventListener('click', async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peer = new Peer();

    peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
    });

    peer.on('call', (incomingCall) => {
        incomingCall.answer(localStream);
        incomingCall.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
    });
});

callPeerButton.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    if (peerId) {
        var call = peer.call(peerId, localStream);
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
    }
});
