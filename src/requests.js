export async function getAvailablePlaces() {
    const getAvailablePlacesURL = 'http://localhost:3000/places'
    const res =  await fetch(getAvailablePlacesURL)
    const resData = await res.json()
    if (!res.ok) {
        throw new Error('Something went wrong, try again')
    }
    return resData.places
    
}

export async function getUserPlaces() {
    const getUserPlacesURL = 'http://localhost:3000/user-places'
    const res =  await fetch(getUserPlacesURL)
    const resData = await res.json()
    if (!res.ok) {
        throw new Error('Something went wrong, try again')
    }
    return resData.places
    
}

export async function updateUserPlaces(places) {
    const updateUserPlacesURL = 'http://localhost:3000/user-places'
    const res = await fetch(updateUserPlacesURL, {
        method: 'PUT',
        body: JSON.stringify({places}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const resData = await res.json()
    if (!res.ok) {
        throw new Error('Something went wrong, try again')
    }
    return resData
}