import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Router from './Router';

function App() {

  useEffect(() => {
    fetch('http://localhost:5000/set-cookie', {
      method: 'GET',
      credentials: 'include',
    })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  }, []);

  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  )
}

export default App