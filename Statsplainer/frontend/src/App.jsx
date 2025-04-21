import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Router from './Router';

function App() {

  useEffect(() => {
    /* fetch('http://localhost:5000/set-cookie', {
      method: 'GET',
      credentials: 'include',
    })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error)); */

    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("user_id");
    document.cookie = `user_id=${user_id}; path=/`; 
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