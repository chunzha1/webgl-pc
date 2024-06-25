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
        alert('Your peer ID is: ' + id); // 提示用户他们的 peer ID
        startCallButton.disabled = true; // 禁用 "Start Call" 按钮
        callPeerButton.disabled = false; // 启用 "Call Peer" 按钮
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
    if (peerId && peer) { // 确保 peer 对象已经初始化
        peer = new Peer();
        call = peer.call(peerId, localStream);
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
    } else {
        if (!peer) {
            alert('Please start a call first to initialize your peer connection.');
        } else if (!peerId) {
            alert('Please enter a valid peer ID.');
        }
    }
});
