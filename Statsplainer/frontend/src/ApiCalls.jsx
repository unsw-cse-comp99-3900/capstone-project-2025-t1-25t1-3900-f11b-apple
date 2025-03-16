let BACKEND_PORT = 5000;

export const apiCallPost = (path, pdfFile) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:${BACKEND_PORT}/` + path, {
        method: 'POST',
        headers: {
          'Content-type': 'application/pdf',
        },
        body: pdfFile
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
        headers: {
          'Content-type': 'application/pdf',
        },
      }).then((response) => {
        if (response.status !== 200) {
          reject('GET Promise reject error');
        }
        return response.json()
      }).then((data) => {
        resolve(data);
      });
    })
  };