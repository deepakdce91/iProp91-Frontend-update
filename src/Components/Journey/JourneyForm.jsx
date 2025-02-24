import React, { useEffect, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Auth from "../User/Login/Auth";
import { useNavigate } from "react-router-dom";

const publicUrls = [
  "laws",
  "faqs",
  "library",
  "case-laws",
  "nri",
  "lend",
  "advice",
];

function modifyUrl(url) {
  try {
    const urlObj = new URL(url);
    const baseUrl = urlObj.origin;
    return `${baseUrl}/authenticate`;
  } catch (error) {
    console.error("Invalid URL:", error.message);
    return null;
  }
}

const Loader = () => (
  <div className="w-full h-screen bg-black flex flex-col items-center justify-center space-y-6">
    <div className="relative w-24 h-24">
      <div className="absolute w-full h-full border-4 border-white rounded-full animate-[spin_3s_linear_infinite]" />
      <div
        className="absolute w-full h-full border-4 border-white rounded-full animate-[spin_2s_linear_infinite]"
        style={{ animationDirection: "reverse" }}
      />
      <div className="absolute w-full h-full border-4 border-blue-500 rounded-full animate-ping" />
    </div>
    <div className="text-white text-xl font-light tracking-wider animate-pulse">
      Loading Your Journey...
    </div>
    <div className="text-gray-400 text-sm">
      Please wait while we prepare your experience
    </div>
  </div>
);

const STORAGE_KEY = 'journey_progress';

const JourneyForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [entryPoint, setEntryPoint] = useState({});
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [redirectionUrl, setRedirectionUrl] = useState();

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const calculateMaxDepth = (question, currentDepth = 0) => {
    if (!question.options) return currentDepth;
    let maxDepth = currentDepth;
    question.options.forEach((option) => {
      if (option.subQuestions && option.subQuestions.length > 0) {
        const subDepth = calculateMaxDepth(
          option.subQuestions[0],
          currentDepth + 1
        );
        maxDepth = Math.max(maxDepth, subDepth);
      }
    });
    return maxDepth;
  };

  // Load progress from localStorage
  const loadProgress = () => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        if (parsedProgress.history && parsedProgress.history.length > 0) {
          setHistory(parsedProgress.history);
          setEntryPoint(parsedProgress.entryPoint || {});
          setIsInitialized(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading progress:', error);
      return false;
    }
  };

  // Save progress to localStorage
  const saveProgress = (newHistory, newEntryPoint) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        history: newHistory,
        entryPoint: newEntryPoint
      }));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Clear progress from localStorage
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  };

  useEffect(() => {
    if (initialQuestions.length > 0 && !isInitialized) {
      const progressLoaded = loadProgress();
      if (!progressLoaded) {
        setHistory([
          {
            question: initialQuestions[0],
            path: [],
            selections: {},
          },
        ]);
        setIsInitialized(true);
      }
      setIsLoading(false);
    }
  }, [initialQuestions, isInitialized]);

  useEffect(() => {
    if (history.length > 0) {
      const newEntryPoint = {};
      history.forEach((item) => {
        if (item.question?.questionText && item.selections) {
          Object.assign(newEntryPoint, item.selections);
        }
      });
      setEntryPoint(newEntryPoint);
      // Save progress whenever history changes
      saveProgress(history, newEntryPoint);
    }
  }, [history]);

  const handleOptionSelect = (option) => {
    if (option.subQuestions && option.subQuestions.length > 0) {
      const nextQuestion = option.subQuestions[0];
      const questionKey = currentState.question.questionText
        .replace(/\s+/g, "-")
        .toLowerCase();
      const newSelections = {
        ...currentState.selections,
        [questionKey]: option.text.replace(/\s+/g, "-"),
      };

      setHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory,
          {
            question: nextQuestion,
            path: [...currentState.path, option.text],
            selections: newSelections,
          },
        ];
        return newHistory;
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleExit = () => {
    clearProgress(); // Clear progress when user explicitly exits
    navigate('/');
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const maxRetries = 3;
      let retryCount = 0;

      while (retryCount < maxRetries) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/questions/fetchAllQuestionsForCustomerJourney`
          );
          if (response?.data?.[0]?.data) {
            setInitialQuestions(response.data[0].data);
            return;
          }
          throw new Error("Invalid data format received");
        } catch (error) {
          console.error(
            `Error fetching questions (attempt ${retryCount + 1}):`,
            error
          );
          retryCount++;
          if (retryCount === maxRetries) {
            toast.error("Failed to load questions. Please refresh the page.");
            setIsLoading(false);
          } else {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }
      }
    };

    fetchQuestions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const maxDepth = initialQuestions.length > 0 ? calculateMaxDepth(initialQuestions[0]) : 0;
  const progress = Math.min(((history.length - 1) / maxDepth) * 95, 95);
  const currentState = history[history.length - 1];

  if (isLoading || !initialQuestions.length || !history.length || !currentState) {
    return <Loader />;
  }

  return (
    <>
    {!isAuthModalOpen && (
      <div className="w-full min-h-screenpx-6 sm:px-32  lg:px-[25vw] xl:px-[30vw] p-6 pt-12 space-y-6">
        <div className="relative">
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
            <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-in-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50" />
              <div className="absolute inset-0 bg-white opacity-10" />
            </div>
          </div>
        </div>

        <div className="bg-black rounded-lg shadow md:p-6 border border-1 relative border-gray-300 px-8 md:px-24 py-10">
          <div className="absolute top-0 right-0 -mt-2 -mr-2">
            <button 
              onClick={handleExit}
              className="z-10 p-2 rounded-full text-gray-200 bg-gray-700 hover:bg-gray-200 hover:text-black group transition-colors"
            >
              <X className="w-6 h-6 text-white group-hover:text-black" strokeWidth={2} />
            </button>
          </div>
          <h2 className="text-xl md:text-3xl text-center font-semibold text-white mb-8">
            {currentState.question.questionText}
          </h2>

          <div className="space-y-3 mt-6 text-gray-200 hover:text-white">
            {currentState.question.options.map((option) => (
              <React.Fragment key={option.id}>
                {option.redirectionLink &&
                (option.redirectionLink.split("/")[
                  option.redirectionLink.split("/").length - 1
                ] === "stage1Form" || option.redirectionLink.split("/")[
                  option.redirectionLink.split("/").length - 1
                ].includes("stage2Form") ||
                  publicUrls.includes(
                    option.redirectionLink.split("/")[
                      option.redirectionLink.split("/").length - 1
                    ]
                  )) ? (
                  <a
                    href={option.redirectionLink}
                    className="w-full block text-center text-lg md:text-xl px-4 py-3 rounded-lg border border-gray-400 hover:border-gray-100 hover:bg-gray-50 hover:bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors my-2"
                  >
                    {option.text}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      if (!option.redirectionLink) {
                        handleOptionSelect(option);
                      } else {
                        if (
                          option.redirectionLink.split("/")[
                            option.redirectionLink.split("/").length - 1
                          ] === "authenticate"
                        ) {
                          openAuthModal();
                        } else {
                          setRedirectionUrl(
                            option.redirectionLink.split("/")[
                              option.redirectionLink.split("/").length - 1
                            ]
                          );
                          openAuthModal();
                        }
                      }
                    }}
                    className="w-full text-center text-lg md:text-xl px-4 py-3 my-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {option.text}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Back button moved inside the white box */}
          {history.length > 1 && (
            <div className="mt-8">
              <button
                onClick={handleBack}
                className="flex items-center px-3 py-2 rounded-lg text-black bg-gray-200 hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}
        </div>
        
        {/* Removed the outer container for the back button that was here */}
        
      </div>
    )}

    {isAuthModalOpen && (
      <Auth
        goBackToStage1={() => {
          setIsAuthModalOpen(false);
        }}
        redirectionUrl={redirectionUrl}
        onClose={closeAuthModal}
        setIsLoggedIn={setIsLoggedIn}
        properties={" "}
        stage1FormData={true}
        onJourneyPage={true}
      />
    )}
  </>
  );
};

export default JourneyForm;