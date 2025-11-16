let video = document.getElementById("video");
let canvas = document.createElement("canvas");
let progressBar = document.getElementById("progressBar");

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

// ---------------------- ENROLL -----------------------

async function enrollFace() {
    let name = document.getElementById("name").value;
    if (!name) return alert("Enter your name!");

    let images = [];

    alert("Capturing 15 images... Keep your face steady!");

    progressBar.style.width = "0%";
    progressBar.innerText = "0%";

    for (let i = 0; i < 15; i++) {
        images.push(captureFrame());

        // update progress bar
        let progress = Math.round(((i + 1) / 15) * 100);
        progressBar.style.width = progress + "%";
        progressBar.innerText = progress + "%";

        await new Promise(r => setTimeout(r, 300)); // delay 0.3s
    }

    fetch("/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, images: images })
    })
        .then(r => r.json())
        .then(d => {
            alert(d.message);
            progressBar.style.width = "0%";
            progressBar.innerText = "0%";
        });
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
