const openCameraBtn = document.getElementById("openCamera");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("video");
const takePhotoBtn = document.getElementById("takePhoto");
const switchCameraBtn = document.getElementById("switchCameraBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const thumbnailGallery = document.getElementById("thumbnailGallery");
const clearGalleryBtn = document.getElementById("clearGalleryBtn");
const noPhotosMessage = document.getElementById("noPhotosMessage");

let stream = null;
let facingMode = "environment";  
let photoUrls = [];


async function openCamera(mode) {
    try {
        if (mode) {
            facingMode = mode;
        }

        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            stream = null;
        }

        const constraints = {
            video: {
                facingMode,
                width: { ideal: 320 },
                height: { ideal: 240 },
            },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        video.srcObject = stream;
        cameraContainer.style.display = "block";

        video.style.display = "block";
        canvas.style.display = "none";

        openCameraBtn.textContent = "Cámara abierta";
        openCameraBtn.disabled = true;
        switchCameraBtn.style.display = "inline-block";
    } catch (e) {
        console.error("Error al abrir la cámara:", e);
        alert("No se pudo acceder a la cámara.");
    }
}

function takePhoto() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!stream || !width || !height) {
        return;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);

    canvas.style.display = "block";
    video.style.display = "none";

    const dataUrl = canvas.toDataURL("image/png");
    photoUrls.push(dataUrl);
    renderGallery();

    closeCamera(false);
}

function closeCamera(updateUi = true) {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }

    video.srcObject = null;

    if (updateUi) {
        cameraContainer.style.display = "none";
        openCameraBtn.textContent = "Abrir cámara";
        openCameraBtn.disabled = false;
        switchCameraBtn.style.display = "none";
    } else {
        openCameraBtn.textContent = "Abrir cámara";
        openCameraBtn.disabled = false;
        cameraContainer.style.display="none"
    }
}

function switchCamera() {
    const newMode = facingMode === "environment" ? "user" : "environment";
    openCamera(newMode);
}


function renderGallery() {
    thumbnailGallery.innerHTML = "";

    if (photoUrls.length === 0) {
        noPhotosMessage.style.display = "block";
        clearGalleryBtn.disabled = true;
        return;
    }

    noPhotosMessage.style.display = "none";
    clearGalleryBtn.disabled = false;

    photoUrls.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.className = "thumbnail";
        thumbnailGallery.appendChild(img);
    });
}

function clearGallery() {
    if (photoUrls.length === 0) return;

    const ok = confirm("¿Eliminar todas las fotos de la galería?");
    if (!ok) return;

    photoUrls = [];
    renderGallery();
}


openCameraBtn.addEventListener("click", () => openCamera());
takePhotoBtn.addEventListener("click", takePhoto);
switchCameraBtn.addEventListener("click", switchCamera);
clearGalleryBtn.addEventListener("click", clearGallery);

window.addEventListener("beforeunload", () => closeCamera(false));
document.addEventListener("DOMContentLoaded", renderGallery);
