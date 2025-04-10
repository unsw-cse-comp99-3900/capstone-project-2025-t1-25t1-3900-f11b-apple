let BACKEND_PORT = 5000;

export const apiCallPost = (path, pdfFile) => {
    const formData = new FormData();
    formData.append("file", pdfFile);

    return new Promise((resolve, reject) => {
        fetch(`http://localhost:${BACKEND_PORT}/` + path, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.status !== 200) {
            reject('POST Promise reject error');
            }
            return response.json()
        })
        .then(data => {
            resolve(data);
        });
    })
};

async function dataURLtoBlob(dataurl) {
    try {
        const response = await fetch(dataurl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data URL: ${response.statusText}`);
        }
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error("Error converting Data URL to Blob:", error);
        return null;
    }
}

export const apiCallPostImg = async (path, imageDataUrl, filename = "image.png") => {
    
    const imageBlob = await dataURLtoBlob(imageDataUrl);
    const formData = new FormData();
    formData.append("file", imageBlob, filename);

    return new Promise((resolve, reject) => {
        fetch(`http://localhost:${BACKEND_PORT}/` + path, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.status !== 200) {
            reject('POST Promise reject error');
            }
            return response.json()
        })
        .then(data => {
            resolve(data);
        });
    })
};

export const apiCallGet = (path, queryString) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:${BACKEND_PORT}/` + path + '?' + queryString, {
            method: 'GET',
        }).then((response) => {
        if (response.status !== 200) {
            reject('GET Promise reject error');
        }
            return response.blob()
        }).then((data) => {
            resolve(data);
        });
    })
};

export const apiCallPostText = (path, body) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:${BACKEND_PORT}/` + path, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(body)
        })
        .then(response => {
            if (response.status !== 200) {
            reject('POST Promise reject error');
            }
            return response.json()
        })
        .then(data => {
            resolve(data);
        });
    })
};
