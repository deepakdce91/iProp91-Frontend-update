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
    // Create a URL object from the input
    const urlObj = new URL(url);

    // Keep only the origin (protocol + domain)
    const baseUrl = urlObj.origin;

    // Append '/authenticate' to the base URL
    return `${baseUrl}/authenticate`;
  } catch (error) {
    // Handle invalid URL input
    console.error("Invalid URL:", error.message);
    return null;
  }
}

// Loader Component
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

  

  // Calculate max depth of questions
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

  // Initialize history when initialQuestions changes
  useEffect(() => {
    if (initialQuestions.length > 0 && !isInitialized) {
      setHistory([
        {
          question: initialQuestions[0],
          path: [],
          selections: {},
        },
      ]);
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [initialQuestions, isInitialized]);

  // Calculate progress only if we have questions
  const maxDepth =
    initialQuestions.length > 0 ? calculateMaxDepth(initialQuestions[0]) : 0;
  const progress = Math.min(((history.length - 1) / maxDepth) * 95, 95);

  const currentState = history[history.length - 1];

  // Update entryPoint whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      const newEntryPoint = {};
      history.forEach((item) => {
        if (item.question?.questionText && item.selections) {
          Object.assign(newEntryPoint, item.selections);
        }
      });
      setEntryPoint(newEntryPoint);
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

      // Smooth scroll to top after option selection
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      // Smooth scroll to top after going back
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Fetch questions with error handling and retry logic
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

    // Smooth scroll to top on load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Guards against rendering with incomplete data
  if (
    isLoading ||
    !initialQuestions.length ||
    !history.length ||
    !currentState
  ) {
    return <Loader />;
  }

  return (
    <>
      {!isAuthModalOpen && (
        <div className="w-full min-h-screen px-6 md:px-16 bg-black max-w-4xl mx-auto p-6 pt-12 space-y-6">
           <div  className="w-full flex justify-end items-end">
           <button 
            onClick={() => navigate('/')} 
            className=" z-10 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
           </div>
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

          <div className="bg-black rounded-lg shadow md:p-6 border border-1 border-gray-300 px-8 md:px-24 py-10">
            <h2 className="text-xl md:text-3xl text-center font-semibold text-white mb-6">
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
                  ] === "stage2Form"  ||
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
          </div>

          <div className="flex items-center space-x-2 text-sm">
            {history.length > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center px-3 py-2 rounded-lg text-black bg-gray-200 hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
        </div>
      )}

      {isAuthModalOpen  && (
        <Auth
          goBackToStage1={() => { 
            setIsAuthModalOpen(false);
          }}
          redirectionUrl = {redirectionUrl}
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
