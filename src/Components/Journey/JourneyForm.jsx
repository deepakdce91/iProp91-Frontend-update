import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const JourneyForm = () => {
  // Initial questions data
  const dummyQues = [ 
    {
      "id": {
        "$numberDouble": "1733572812137.0"
      },
      "questionText": "Do you own a property?",
      "options": [
        {
          "id": {
            "$numberDouble": "1733572827927.0"
          },
          "text": "Yes",
          "subQuestions": [
            {
              "id": {
                "$numberDouble": "1733928841472.0"
              },
              "redirectionLink": null,
              "questionText": "Is your property?",
              "options": [
                {
                  "id": {
                    "$numberDouble": "1733928847936.0"
                  },
                  "text": "Residential",
                  "redirectionLink": null,
                  "subQuestions": [
                    {
                      "id": {
                        "$numberDouble": "1733929159035.0"
                      },
                      "redirectionLink": null,
                      "questionText": "Your property is for",
                      "options": [
                        {
                          "id": {
                            "$numberDouble": "1733929174832.0"
                          },
                          "text": "Self use",
                          "redirectionLink": null,
                          "subQuestions": [
                            {
                              "id": {
                                "$numberDouble": "1733929399804.0"
                              },
                              "redirectionLink": null,
                              "questionText": "Do you want to",
                              "options": [
                                {
                                  "id": {
                                    "$numberDouble": "1733929404185.0"
                                  },
                                  "text": "Sell",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                },
                                {
                                  "id": {
                                    "$numberDouble": "1733929452138.0"
                                  },
                                  "text": "Manage",
                                  "redirectionLink": null,
                                  "subQuestions": [
                                    {
                                      "id": {
                                        "$numberDouble": "1733929519780.0"
                                      },
                                      "redirectionLink": null,
                                      "questionText": "What management service do you need?",
                                      "options": [
                                        {
                                          "id": {
                                            "$numberDouble": "1733929578164.0"
                                          },
                                          "text": "Document Management",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929603046.0"
                                          },
                                          "text": "Join other verified owners of your project",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929623713.0"
                                          },
                                          "text": "Check RERA Documents",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929689877.0"
                                          },
                                          "text": "Check Reviews from verified owners of you project",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/realinsight",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929717144.0"
                                          },
                                          "text": "Seek Legal Advise",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/advice",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929742614.0"
                                          },
                                          "text": "Need financial assistance",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/lend",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929898862.0"
                                          },
                                          "text": "Need documentation support",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/handBook",
                                          "subQuestions": []
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "id": {
                            "$numberDouble": "1733929180737.0"
                          },
                          "text": "Investment",
                          "redirectionLink": null,
                          "subQuestions": [
                            {
                              "id": {
                                "$numberDouble": "1733929340445.0"
                              },
                              "redirectionLink": null,
                              "questionText": "Do you want to",
                              "options": [
                                {
                                  "id": {
                                    "$numberDouble": "1733929345432.0"
                                  },
                                  "text": "Sell",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                },
                                {
                                  "id": {
                                    "$numberDouble": "1733929352767.0"
                                  },
                                  "text": "Rent",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                },
                                {
                                  "id": {
                                    "$numberDouble": "1733929359284.0"
                                  },
                                  "text": "Manage",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": {
                    "$numberDouble": "1733928852887.0"
                  },
                  "text": "Commercial",
                  "redirectionLink": null,
                  "subQuestions": [
                    {
                      "id": {
                        "$numberDouble": "1733929167117.0"
                      },
                      "redirectionLink": null,
                      "questionText": "Your Property is for",
                      "options": [
                        {
                          "id": {
                            "$numberDouble": "1733929188101.0"
                          },
                          "text": "Self Use",
                          "redirectionLink": null,
                          "subQuestions": [
                            {
                              "id": {
                                "$numberDouble": "1733929415486.0"
                              },
                              "redirectionLink": null,
                              "questionText": "Do you want to",
                              "options": [
                                {
                                  "id": {
                                    "$numberDouble": "1733929426956.0"
                                  },
                                  "text": "Sell",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                },
                                {
                                  "id": {
                                    "$numberDouble": "1733929446931.0"
                                  },
                                  "text": "Manage",
                                  "redirectionLink": null,
                                  "subQuestions": [
                                    {
                                      "id": {
                                        "$numberDouble": "1733929528065.0"
                                      },
                                      "redirectionLink": null,
                                      "questionText": "What management service do you need?",
                                      "options": [
                                        {
                                          "id": {
                                            "$numberDouble": "1733929923276.0"
                                          },
                                          "text": "Document Management",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929944992.0"
                                          },
                                          "text": "Join other verified owners of your project",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage2Form",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929960109.0"
                                          },
                                          "text": "Check RERA Documents",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733929976968.0"
                                          },
                                          "text": "Check Reviews from verified owners of you project",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/realinsight",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733930000892.0"
                                          },
                                          "text": "Seek Legal Advise",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/advice",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733930017081.0"
                                          },
                                          "text": "Need financial assistance",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/lend",
                                          "subQuestions": []
                                        },
                                        {
                                          "id": {
                                            "$numberDouble": "1733930031959.0"
                                          },
                                          "text": "Need documentation support",
                                          "redirectionLink": "https://i-prop91-frontend-update.vercel.app/handBook",
                                          "subQuestions": []
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "id": {
                            "$numberDouble": "1733929193137.0"
                          },
                          "text": "Investment",
                          "redirectionLink": null,
                          "subQuestions": [
                            {
                              "id": {
                                "$numberDouble": "1733929287200.0"
                              },
                              "redirectionLink": null,
                              "questionText": "Do you want to",
                              "options": [
                                {
                                  "id": {
                                    "$numberDouble": "1733929306133.0"
                                  },
                                  "text": "Sell",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                },
                                {
                                  "id": {
                                    "$numberDouble": "1733929314383.0"
                                  },
                                  "text": "Rent",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                },
                                {
                                  "id": {
                                    "$numberDouble": "1733929319733.0"
                                  },
                                  "text": "Manage",
                                  "redirectionLink": "https://i-prop91-frontend-update.vercel.app/stage1Form",
                                  "subQuestions": []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": {
            "$numberDouble": "1733572834502.0"
          },
          "text": "No",
          "subQuestions": []
        }
      ]
    }
  ];

  const [initialQuestions, setInitialQuestions] = useState(dummyQues);

  // State to track navigation history
  const [history, setHistory] = useState([{
    question: initialQuestions[0],
    path: []
  }]);

  // Get current question from history
  const currentState = history[history.length - 1];

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (option.subQuestions && option.subQuestions.length > 0) {
      const nextQuestion = option.subQuestions[0];
      setHistory([...history, {
        question: nextQuestion,
        path: [...currentState.path, option.text]
      }]);
    }
  };

  // Handle going back
  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  useEffect(() => {
    
    axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/questions/fetchAllQuestionsForCustomerJourney`,
            )
            .then((response) => {
              if (response) {
                // console.log(response.data[0].data)
                setInitialQuestions(response.data[0].data);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });

  }, [])
  

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {initialQuestions.length > 0 && <>
      {/* Navigation Path */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {history.length > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <div className="flex items-center space-x-2">
          {currentState.path.map((step, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <span>{step}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentState.question.questionText}
        </h2>
        
        {/* Options */}
        <div className="space-y-3">
          {currentState.question.options.map((option) => (
            <>
            {option.redirectionLink ? <a
              key={option.id.$numberDouble}
              href={option.redirectionLink}
              className="w-full block text-left px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {option.text}
            </a> : <button
              key={option.id.$numberDouble}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {option.text}
            </button>}

            {/* {option.redirectionLink !== "" && } */}

            </>
          ))}
        </div>
      </div>
      </>}
    </div>
  );
};

export default JourneyForm;