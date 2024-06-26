let localStream;
let remoteStream;
let peer;
let isPeerInitialized = false; // 新增标志变量
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const shareIdSpan = document.getElementById('shareId');
const remoteIdInput = document.getElementById('remoteId');
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');

startButton.addEventListener('click', startSharing);
connectButton.addEventListener('click', connectToPeer);
disconnectButton.addEventListener('click', disconnect);

function startSharing() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            localVideo.srcObject = stream;
            initializePeer();
        })
        .catch(error => {
            console.error('Error accessing media devices:', error);
        });
}

function initializePeer() {
    peer = new Peer();
    
    peer.on('open', (id) => {
        shareIdSpan.textContent = id;
        isPeerInitialized = true; // 设置标志变量为true
    });

    peer.on('call', (call) => {
        call.answer(localStream);
        handleCall(call);
    });

    peer.on('error', (err) => {
        console.error('PeerJS error:', err);
    });
}

function connectToPeer() {
    if (!isPeerInitialized) {
        console.error('Peer is not initialized yet.');
        return;
    }

    const remoteId = remoteIdInput.value;
    const call = peer.call(remoteId, localStream);
    handleCall(call);
}

function handleCall(call) {
    call.on('stream', (stream) => {
        remoteStream = stream;
        remoteVideo.srcObject = stream;
        disconnectButton.disabled = false;
    });

    call.on('close', () => {
        remoteVideo.srcObject = null;
        disconnectButton.disabled = true;
    });

    call.on('error', (err) => {
        console.error('Call error:', err);
    });
}

function disconnect() {
    if (remoteStream) {
        remoteVideo.srcObject = null;
        disconnectButton.disabled = true;
    }
}
