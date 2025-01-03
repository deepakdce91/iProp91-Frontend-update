import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from 'react-router-dom';


const JourneyForm = () => {
  // Initial questions data
  const dummyQues = [
    {
      id: {
        $numberDouble: "1733572812137.0",
      },
      questionText: "Do you own a property?",
      options: [
        {
          id: {
            $numberDouble: "1733572827927.0",
          },
          text: "Yes",
          subQuestions: [
            {
              id: {
                $numberDouble: "1733928841472.0",
              },
              redirectionLink: null,
              questionText: "Is your property?",
              options: [
                {
                  id: {
                    $numberDouble: "1733928847936.0",
                  },
                  text: "Residential",
                  redirectionLink: null,
                  subQuestions: [
                    {
                      id: {
                        $numberDouble: "1733929159035.0",
                      },
                      redirectionLink: null,
                      questionText: "Your property is for",
                      options: [
                        {
                          id: {
                            $numberDouble: "1733929174832.0",
                          },
                          text: "Self use",
                          redirectionLink: null,
                          subQuestions: [
                            {
                              id: {
                                $numberDouble: "1733929399804.0",
                              },
                              redirectionLink: null,
                              questionText: "Do you want to",
                              options: [
                                {
                                  id: {
                                    $numberDouble: "1733929404185.0",
                                  },
                                  text: "Sell",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                                {
                                  id: {
                                    $numberDouble: "1733929452138.0",
                                  },
                                  text: "Manage",
                                  redirectionLink: null,
                                  subQuestions: [
                                    {
                                      id: {
                                        $numberDouble: "1733929519780.0",
                                      },
                                      redirectionLink: null,
                                      questionText:
                                        "What management service do you need?",
                                      options: [
                                        {
                                          id: {
                                            $numberDouble: "1733929578164.0",
                                          },
                                          text: "Document Management",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929603046.0",
                                          },
                                          text: "Join other verified owners of your project",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929623713.0",
                                          },
                                          text: "Check RERA Documents",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929689877.0",
                                          },
                                          text: "Check Reviews from verified owners of you project",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/realinsight",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929717144.0",
                                          },
                                          text: "Seek Legal Advise",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/advice",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929742614.0",
                                          },
                                          text: "Need financial assistance",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/lend",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929898862.0",
                                          },
                                          text: "Need documentation support",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/handBook",
                                          subQuestions: [],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: {
                            $numberDouble: "1733929180737.0",
                          },
                          text: "Investment",
                          redirectionLink: null,
                          subQuestions: [
                            {
                              id: {
                                $numberDouble: "1733929340445.0",
                              },
                              redirectionLink: null,
                              questionText: "Do you want to",
                              options: [
                                {
                                  id: {
                                    $numberDouble: "1733929345432.0",
                                  },
                                  text: "Sell",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                                {
                                  id: {
                                    $numberDouble: "1733929352767.0",
                                  },
                                  text: "Rent",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                                {
                                  id: {
                                    $numberDouble: "1733929359284.0",
                                  },
                                  text: "Manage",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: {
                    $numberDouble: "1733928852887.0",
                  },
                  text: "Commercial",
                  redirectionLink: null,
                  subQuestions: [
                    {
                      id: {
                        $numberDouble: "1733929167117.0",
                      },
                      redirectionLink: null,
                      questionText: "Your Property is for",
                      options: [
                        {
                          id: {
                            $numberDouble: "1733929188101.0",
                          },
                          text: "Self Use",
                          redirectionLink: null,
                          subQuestions: [
                            {
                              id: {
                                $numberDouble: "1733929415486.0",
                              },
                              redirectionLink: null,
                              questionText: "Do you want to",
                              options: [
                                {
                                  id: {
                                    $numberDouble: "1733929426956.0",
                                  },
                                  text: "Sell",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                                {
                                  id: {
                                    $numberDouble: "1733929446931.0",
                                  },
                                  text: "Manage",
                                  redirectionLink: null,
                                  subQuestions: [
                                    {
                                      id: {
                                        $numberDouble: "1733929528065.0",
                                      },
                                      redirectionLink: null,
                                      questionText:
                                        "What management service do you need?",
                                      options: [
                                        {
                                          id: {
                                            $numberDouble: "1733929923276.0",
                                          },
                                          text: "Document Management",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929944992.0",
                                          },
                                          text: "Join other verified owners of your project",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929960109.0",
                                          },
                                          text: "Check RERA Documents",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733929976968.0",
                                          },
                                          text: "Check Reviews from verified owners of you project",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/realinsight",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733930000892.0",
                                          },
                                          text: "Seek Legal Advise",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/advice",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733930017081.0",
                                          },
                                          text: "Need financial assistance",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/lend",
                                          subQuestions: [],
                                        },
                                        {
                                          id: {
                                            $numberDouble: "1733930031959.0",
                                          },
                                          text: "Need documentation support",
                                          redirectionLink:
                                            "https://i-prop91-frontend-update.vercel.app/handBook",
                                          subQuestions: [],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: {
                            $numberDouble: "1733929193137.0",
                          },
                          text: "Investment",
                          redirectionLink: null,
                          subQuestions: [
                            {
                              id: {
                                $numberDouble: "1733929287200.0",
                              },
                              redirectionLink: null,
                              questionText: "Do you want to",
                              options: [
                                {
                                  id: {
                                    $numberDouble: "1733929306133.0",
                                  },
                                  text: "Sell",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                                {
                                  id: {
                                    $numberDouble: "1733929314383.0",
                                  },
                                  text: "Rent",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                                {
                                  id: {
                                    $numberDouble: "1733929319733.0",
                                  },
                                  text: "Manage",
                                  redirectionLink:
                                    "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  subQuestions: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: {
            $numberDouble: "1733572834502.0",
          },
          text: "No",
          subQuestions: [],
        },
      ],
    },
  ];
  
  const [initialQuestions, setInitialQuestions] = useState(dummyQues);
  const [entryPoint, setEntryPoint] = useState({});
  const [history, setHistory] = useState([
    {
      question: initialQuestions[0],
      path: [],
      selections: {} // Add selections to track question-answer pairs
    },
  ]);

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

  const maxDepth = calculateMaxDepth(initialQuestions[0]);
  const progress = Math.min(((history.length - 1) / maxDepth) * 95, 95);

  const currentState = history[history.length - 1];

  // Update entryPoint whenever history changes
  useEffect(() => {
    const newEntryPoint = {};
    history.forEach(item => {
      if (item.question.questionText && item.selections) {
        const questionKey = item.question.questionText.replace(/\s+/g, '-').toLowerCase();
        Object.assign(newEntryPoint, item.selections);
      }
    });
    setEntryPoint(newEntryPoint);
  }, [history]);

  const handleOptionSelect = (option) => {
    if (option.subQuestions && option.subQuestions.length > 0) {
      const nextQuestion = option.subQuestions[0];
      const questionKey = currentState.question.questionText.replace(/\s+/g, '-').toLowerCase();
      const newSelections = {
        ...currentState.selections,
        [questionKey]: option.text.replace(/\s+/g, '-')
      };
      
      const newHistory = [
        ...history,
        {
          question: nextQuestion,
          path: [...currentState.path, option.text],
          selections: newSelections
        },
      ];
      setHistory(newHistory);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/questions/fetchAllQuestionsForCustomerJourney`
      )
      .then((response) => {
        if (response) {
          setInitialQuestions(response.data[0].data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="w-full px-16 bg-black h-screen max-w-4xl mx-auto p-6 pt-12 space-y-6">
      {initialQuestions.length > 0 && (
        <>
          <div className="relative">
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-lg">
              <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
              <div
                className="h-full bg-white rounded-full transition-all duration-300 ease-in-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-50" />
                <div className="absolute inset-0  bg-white opacity-10" />
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg shadow p-6 border border-1 border-gray-300 px-24 py-10">
            <h2 className="text-xl md:text-3xl text-center font-semibold text-white mb-6">
              {currentState.question.questionText}
            </h2>

            <div className="space-y-3 mt-6 text-gray-200 hover:text-white">
              {currentState.question.options.map((option) => (
                <React.Fragment key={option.id.$numberDouble}>
                  {option.redirectionLink ? (
                    <a
                    href={`${option.redirectionLink}?entryPoint=${encodeURIComponent(JSON.stringify(entryPoint))}`}
                      className="w-full block text-center text-sm md:text-xl px-4 py-3 rounded-lg border border-gray-400 hover:border-gray-100 hover:bg-gray-50 hover:bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors my-2"
                    >
                      {option.text}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleOptionSelect(option)}
                      className="w-full text-center text-sm md:text-xl px-4 py-3 my-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
        </>
      )}
    </div>
  );
};

export default JourneyForm;