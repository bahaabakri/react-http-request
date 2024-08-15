import { getAvailablePlaces } from '../requests.js';
import Places from './Places.jsx';
import {sortPlacesByDistance} from '../loc.js'
import useFetch from '../hooks/useFetch.js'

const getSortedAvailablePlaces = async() => {
  const availablePlacesBeforeSort = await getAvailablePlaces()
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(sortPlacesByDistance(
        availablePlacesBeforeSort,
        position.coords.latitude,
        position.coords.longitude
      ))
    })
  })
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {fetchedData: availablePlaces, isLoading, error} = useFetch(getSortedAvailablePlaces)

  return (
    <>
      {isLoading && <div className="loader"></div>}
      {(!error && !isLoading) && <Places
        title="Available Places"
        places={availablePlaces}
        fallbackText="No places available."
        onSelectPlace={onSelectPlace}
      />}
      {
        (error && !isLoading) && 
        <div className='error'>
          {error.message || 'Something went wrong, try again'}
        </div> 
      }
    </>

  );
}
