import axios from "axios"
import React, { useState, useContext, useEffect } from "react"

const table = {
  computers: 18,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = "https://opentdb.com/api.php?"

const url = ""
const tempUrl =
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  //this one is for displaying the input Quiz form only
  const [waiting, setWaiting] = useState(true)

  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [error, setError] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchQuestions = async (url) => {
    setLoading(true)
    setWaiting(false)

    const response = await axios(url)
      .then((response) => {
        if (response) {
          const data = response.data.results

          if (data.length > 0) {
            console.log(data)
            setQuestions(data)
            setLoading(false)
            setWaiting(false)
            setError(false)
          } else {
            // setLoading(false)
            setWaiting(true)
            setError(true)
          }
        } else {
          setWaiting(true)
        }
      })
      .catch((error) => {
        console.log(error)
        setWaiting(true)
      })
  }

  const nextQuestion = () => {
    //check correct
    setIndex((prevIndex) => {
      const index = prevIndex + 1
      if (index > questions.length - 1) {
        openModal()
        return 0
      } else {
        return index
      }
    })
  }

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((prevValue) => {
        return prevValue + 1
      })
    }

    nextQuestion()
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }

  useEffect(() => {
    fetchQuestions(tempUrl)
  }, [])

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
