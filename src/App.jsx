import { useRef, useState, useCallback } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import {getUserPlaces, updateUserPlaces} from './requests.js'
import useFetch from './hooks/useFetch.js'
function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const {fetchedData: userPlaces, isLoading, error, setFetchedData: setUserPlaces} = useFetch(getUserPlaces)

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }
  function showSnackbar(message) {
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    x.textContent = message
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  async function  handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces])
    } catch(error) {
      setError(error)
      setUserPlaces(userPlaces)
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try {
      await updateUserPlaces([...userPlaces].filter((place) => place.id !== selectedPlace.current.id))
    } catch(error) {
      showSnackbar(error.message || 'Something went wrong')
      setUserPlaces(userPlaces)
    }
    setModalIsOpen(false);
  }, [userPlaces, setUserPlaces]);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {(isLoading) && <div className='loader'></div>}
        {
          (!isLoading && !error) &&         
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        }
        {
          (!isLoading && error) &&
          <div className='error'>
            {error.message || 'Something went wrong, try again'}
          </div>
        }


        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
      <div id="snackbar"></div>
    </>
  );
}

export default App;
