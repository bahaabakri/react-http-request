import {useEffect, useState} from 'react'

const useFetch = ((getData, defaultData = []) => {
    const [fetchedData, setFetchedData] = useState(defaultData);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    useEffect(() => {
        const fetchDate = async() => {
          setIsLoading(true)
          try {
            setFetchedData(await getData())
          } catch(error) {
            setError(error)
          }
          setIsLoading(false)
        }
        fetchDate()
      }, [getData])

      return {
        fetchedData,
        isLoading,
        error,
        setFetchedData
      }
})

export default useFetch