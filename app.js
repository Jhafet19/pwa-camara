const openCameraBtn = document.getElementById("openCamera");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("video");
const takePhotoBtn = document.getElementById("takePhoto");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let stream = null;

async function openCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 320, height: 240 }
        });
        
        video.srcObject = stream;
        cameraContainer.style.display = "block";
        openCameraBtn.disabled = true;
    } catch (e) {
        alert("No se pudo acceder a la cámara");
    }
}

function takePhoto() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    closeCamera();
}

function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        openCameraBtn.disabled = false;
    }
}

openCameraBtn.addEventListener("click", openCamera);
takePhotoBtn.addEventListener("click", takePhoto);

window.addEventListener("beforeunload", closeCamera);
