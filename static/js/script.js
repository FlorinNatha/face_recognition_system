let video = document.getElementById("video");
let canvas = document.createElement("canvas");
let progressBar = document.getElementById("progressBar");
let progressHint = document.getElementById("progressHint");
let thumbs = document.getElementById("thumbs");
let toastEl = document.getElementById('liveToast');
let toastBody = document.getElementById('toastBody');

let bsToast = null;
if (toastEl && window.bootstrap) {
    bsToast = new bootstrap.Toast(toastEl, { delay: 2500 });
}

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(() => alert("Camera access blocked!"));

// Capture a single frame
function captureFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg");
}

function addThumb(dataUrl) {
    if (!thumbs) return;
    const img = document.createElement('img');
    img.src = dataUrl;
    thumbs.prepend(img);
    // limit thumbs to 15
    while (thumbs.children.length > 15) thumbs.removeChild(thumbs.lastChild);
}

function showToast(msg) {
    if (toastBody) toastBody.textContent = msg;
    if (bsToast) bsToast.show();
    else alert(msg);
}

// ---------------------- ENROLL -----------------------

async function enrollFace() {
    let name = document.getElementById("name").value;
    if (!name) return alert("Enter your name!");

    let images = [];

    showToast("Capturing 15 images... Keep your face steady!");

    progressBar.style.width = "0%";
    progressBar.innerText = "0% (0/15)";
    if (progressHint) progressHint.innerText = 'Capturing...';

    // disable buttons while capturing
    let enrollBtn = document.getElementById("enrollBtn");
    let recognizeBtn = document.getElementById("recognizeBtn");
    if (enrollBtn) enrollBtn.disabled = true;
    if (recognizeBtn) recognizeBtn.disabled = true;


    for (let i = 0; i < 15; i++) {
        const data = captureFrame();
        images.push(data);
        addThumb(data);

        // update progress bar
        let progress = Math.round(((i + 1) / 15) * 100);
        progressBar.style.width = progress + "%";
        progressBar.innerText = progress + "% (" + (i + 1) + "/15)";

        await new Promise(r => setTimeout(r, 300)); // delay 0.3s
    }

    try {
        let res = await fetch("/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, images: images })
        });
        let d = await res.json();
        showToast(d.message || 'Enrollment complete');
    } catch (err) {
        console.error(err);
        showToast('Enrollment failed. See console for details.');
    } finally {
        // reset progress and re-enable buttons
        progressBar.style.width = "0%";
        progressBar.innerText = "0% (0/15)";
        if (progressHint) progressHint.innerText = 'Idle';
        if (enrollBtn) enrollBtn.disabled = false;
        if (recognizeBtn) recognizeBtn.disabled = false;
    }
}

// ---------------------- RECOGNIZE ---------------------

function recognizeFace() {
    let frame = captureFrame();

    fetch("/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame })
    })
        .then(res => res.json())
        .then(data => alert("Identified: " + data.name));
}
