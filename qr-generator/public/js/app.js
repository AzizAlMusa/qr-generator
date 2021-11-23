const qrForm = document.querySelector(".qr-generator-form");
const qrInput = document.querySelector(".input-text");
const foregroundInput = document.querySelector("#foreground-input");
const backgroundInput = document.querySelector("#background-input");

const uploadInput = document.querySelector(".custom-file-upload");
const previewImage = document.querySelector("#image-preview");
const cancelButton = document.querySelector(".cancel-icon");

const outputContainer = document.querySelector(".output-container");
const imgContainer = document.querySelector(".img-container");
const qrCanvas = document.querySelector(".qr-canvas");
const placeholderImg = document.querySelector(".qr-viewer");
const errorMessage = document.querySelector(".error-message");

const downloadLink = document.querySelector("#download-btn");
const downloadButton = document.querySelector(".download-btn-trigger");

const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

/**
 * QR fetch
 */
qrForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = qrInput.value;
  const foregroundColor = foregroundInput.value.slice(1, 7);
  const backgroundColor = backgroundInput.value.slice(1, 7);
  if (text.length === 0) {
  }

  url = "/convert?plainText=" + text + "&color=" + foregroundColor + "&bgcolor=" + backgroundColor;

  fetch(url).then((response) => {
    response.json().then((qrMessage) => {
      //TODO: need to handle different errors: low level and invalid input
      if (qrMessage.error) {
        qrInput.classList.add("valid-input-message");
        qrInput.placeholder = "Enter something here";
      } else {
        errorMessage.style.display = "none";
        //check if a QR code has been generated
        if (document.querySelector(".qr-image")) {
          //remove old QR code
          imgContainer.removeChild(document.querySelector(".qr-image"));
        }

        //Extract svg tag from response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(qrMessage.body, "text/xml");
        const qrImg = xmlDoc.getElementsByTagName("svg")[0];
        qrImg.classList.add("qr-image");

        //Set width and height
        const svgWidth = qrImg.width.baseVal.value;
        const svgHeight = qrImg.height.baseVal.value;
        qrImg.setAttribute("viewBox", "0 0 " + svgWidth + " " + svgHeight);

        //Handle center logo position and size
        const logoX = svgWidth / 2 - 50;
        const logoY = svgWidth / 2 - 50;

        if (fileInput.files.length != 0) {
          const logo = previewImage.src;
          const embed = `<image href="${logo}" x="${logoX}" y="${logoY}" height="100px" width="100px" />`;
          //Add logo to svg tag children
          qrImg.insertAdjacentHTML("beforeend", embed);
        }

        //Remove placer holder and append svg qr code
        placeholderImg.style.display = "none";
        imgContainer.appendChild(qrImg);
        imgContainer.style.display = "block";
        //Show download Button
        downloadLink.style.display = "block";
        downloadButton.style.display = "block";
      }
    });
  });
});

/**
 * Color change handler
 */
foregroundInput.addEventListener("input", colorChange, false);
backgroundInput.addEventListener("input", colorChange, false);

function colorChange(event) {
  const qrImg = document.querySelector(".qr-image");

  if (qrImg) {
    if (event.target.name === "foreground") {
      qrImg.getElementsByTagName("path")[0].style.fill = event.target.value;
    } else {
      qrImg.getElementsByTagName("rect")[0].style.fill = event.target.value;
    }
  }
}

/**
 * handle image upload
 */
const fileInput = document.getElementById("file-upload");
fileInput.addEventListener("change", handleImage, false);

function handleImage() {
  const fileList = this.files;

  //allow only one file
  if (fileList.length !== 1) {
    console.log("Please upload an image file");
    return;
  }

  const imageFile = fileList[0];

  //validate file type
  const validTypes = ["image/gif", "image/jpeg", "image/png"];
  if (validTypes.includes(imageFile.type)) {
    const reader = new FileReader();

    //read image as URL
    reader.readAsDataURL(imageFile);
    reader.onload = function (event) {
      uploadInput.style.display = "none";

      previewImage.src = event.target.result;
      previewImage.style.display = "inline";
      cancelButton.style.display = "inline";
    };
  }
}

cancelButton.addEventListener("click", resetImage);

function resetImage(event) {
  //clear image preview
  previewImage.style.display = "none";
  cancelButton.style.display = "none";

  //clear file - check whether garbage collection happens here
  fileInput.value = null;

  //show input again
  uploadInput.style.display = "inline-block";
}

downloadButton.addEventListener("click", saveImg);
function saveImg() {
  const qrImg = document.querySelector(".qr-image");
  const ctx = qrCanvas.getContext("2d");

  const svgURL = new XMLSerializer().serializeToString(qrImg);
  const img = new Image();

  qrCanvas.width = 500;
  qrCanvas.height = 500;

  img.onload = function () {
    ctx.drawImage(this, 0, 0, qrCanvas.width, qrCanvas.height);
    downloadLink.href = qrCanvas.toDataURL();
    downloadLink.download = "qr-code.png";

    downloadLink.click();
  };
  img.src = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
}

qrInput.addEventListener("input", inputChange);

function inputChange() {
  qrInput.classList.remove("valid-input-message");
  qrInput.placeholder = "e.g. http://youtube.com";
}
