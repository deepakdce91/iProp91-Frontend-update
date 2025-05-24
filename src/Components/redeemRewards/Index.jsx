import { useEffect, useState } from "react";
import NameHeader from "../../Components/Concierge/Nameheader";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { BiSolidCoinStack } from "react-icons/bi";
import { FiPlus, FiMinus } from "react-icons/fi";
import axios from "axios";
import DOMPurify from "dompurify";
import Breadcrumb from "../Landing/Breadcrumb";


import { BiCoin } from "react-icons/bi";
import WeDoMore from "../Landing/WeDoMore";

function toTitleCase(str) {
  return str
    .split("_") // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join words with space
}

export default function FirstSafe() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [redeemRewards, setRedeemRewards] = useState([]);
  const [rewardCount, setRewardCount] = useState(0);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [faqData, setFaqData] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle FAQ items
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    window.scrollTo(0, 0);
  }, []);

  // Fetch FAQ data for both logged in and not logged in users
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/faqs/fetchAllActiveRewardPointsFAQs`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setFaqData(response.data);
        console.log("FAQ data:", response.data);
      } catch (error) {
        console.error(
          "Error fetching FAQ data:",
          error.response?.data || error.message
        );
      }
    };
    fetchFAQs();
  }, []);

  const convertToVoucher = async (rewardName, rewardType) => {
    // Convert the points to voucher
    let token = localStorage.getItem("token");
    let tokenid = jwtDecode(token);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/redeemVouchers/addvoucher?userId=${tokenid.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            rewardName: rewardName,
            rewardType: rewardType,
            userId: tokenid.userId,
          }),
        }
      );
      const data = await response.json();
      if(data.success === true){
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }

      
      setChangeMade(!changeMade);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add voucher");
      // Handle errors - perhaps show an error message to the user
    }
  };

  // Fetch user rewards data if logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserRewards = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/rewards/fetchAllActiveRedemptionRewards?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setRedeemRewards(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserRewards();
  }, [isLoggedIn]);

  // Fetch active vouchers, reward points, and transaction history if logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserVouchers = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/redeemVouchers/fetchactivevouchersbyuser?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        setActiveVouchers(data);

        const response2 = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/fetchrewardpoints?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data2 = await response2.json();
        setRewardCount(data2.rewardPoints);

        // Fetch transaction history
        setIsLoading(true);
        const transactionResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/rewardTransactionHistory?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const transactionData = await transactionResponse.json();
        if (transactionData.success) {
          setTransactionHistory(transactionData.transactions);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchUserVouchers();
  }, [changeMade, isLoggedIn]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Breadcrumb items for FAQ section
  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Rewards FAQ" },
  ];

  // FAQ section component that will be reused for both logged in and not logged in users
  const FAQSection = () => (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-800 my-4 mb-8">
      {/* FAQ Section Header */}
      <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-black p-3">
        Frequently Asked Questions
      </div>
      
      {/* FAQ Content */}
      <div className="w-full p-4">
        {faqData && faqData.length > 0 ? (
          faqData.map((faq, index) => {
            const prefix = "Frequently Asked Questions (FAQs) – Property Tax – Gurgaon";
            const cleanContent = faq.content.startsWith(prefix)
              ? faq.content.slice(prefix.length).trim()
              : faq.content.trim();

            // Check if cleanContent contains HTML
            const isHTML = /<[^>]+>/.test(cleanContent);
            let sanitizedContent;

            if (isHTML) {
              // If it's already HTML, just sanitize it
              sanitizedContent = DOMPurify.sanitize(cleanContent);
            } else {
              // If it's plain text, replace links and then sanitize
              const formattedContent = cleanContent.replace(
                /(https?:\/\/[^\s]+)/g,
                '<a href="$1" target="_blank" class="text-black underline">$1</a>'
              );
              sanitizedContent = DOMPurify.sanitize(formattedContent);
            }

            // Add styles to existing links if any
            sanitizedContent = sanitizedContent.replace(
              /<a /g,
              '<a class="text-black underline" '
            );

            return (
              <div
                key={index}
                className={`my-4 transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "border-[1px] border-yellow-600/50 bg-gray-100 max-h-[300px] overflow-y-scroll"
                    : "border-[1px] border-yellow-600"
                } p-4 hover:scale-105 transition-all`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer text-black"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="md:text-lg text-base font-medium">
                    {faq.title}
                  </h3>
                  <div className="text-xl text-black">
                    {openIndex === index ? <FiMinus /> : <FiPlus />}
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "mt-4" : "max-h-0"
                  }`}
                >
                  <hr className="border-t-[2px] border-yellow-600 mb-4" />
                  <p
                    className="mt-7 text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: sanitizedContent,
                    }}
                  ></p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="text-center text-gray-400">
              <p className="text-xl font-medium mb-2">Loading FAQs...</p>
              <p>Please wait while we fetch the rewards information.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isLoggedIn ? (
        // REWARDS DASHBOARD FOR LOGGED IN USERS
        <div className="w-full min-h-screen flex flex-col lg:gap-1 mt-20 md:mt-0 bg-gray-100">
          <NameHeader
            description={
              "Every point you earn brings you closer to amazing rewards. Trade them for vouchers and enjoy discounts and special offers!"
            }
            name={"Rewards"}
          />
          <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-black p-2">
            You currently have{" "}
            <span className="underline mx-1">{rewardCount}</span> reward points{" "}
            <BiSolidCoinStack />
          </div>

          <div className="w-full flex-col bg-gray-100 flex items-center">
            {/* Rewards Section - keeping your original implementation */}
            <div className="flex-row flex flex-wrap my-6 shadow-md border border-yellow-600/30 rounded-lg w-full justify-center m-4">
              {redeemRewards.length > 0 &&
                redeemRewards.map((item, index) => {
                  return (
                    <div key={index} className="w-64 border border-yellow-600/50 rounded-lg m-3 bg-white shadow-lg">
                      <div className="p-2.5 h-56 mx-2 my-2 overflow-hidden rounded-xl bg-clip-border">
                        <img
                          src="/reward-pic.jpg"
                          alt="card-image"
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-black text-xl font-semibold">
                            {toTitleCase(item.name)}
                          </p>
                          <div className="text-yellow-600 w-28 text-right text-lg font-semibold">
                            {item.amount}{" "}
                            {item.discountType === "percentage" ? "%" : <BiCoin className="inline"/>}
                          </div>
                        </div>
                        <p className="text-gray-800 leading-normal font-light">
                          {item.description}
                        </p>
                        <button
                          onClick={() => convertToVoucher(item.name, item.type)}
                          className="rounded-md w-full mt-6 bg-black py-2 px-4 border border-transparent text-center text-sm text-white font-semibold transition-all shadow-md hover:shadow-lg focus:bg-/black-reward.avif focus:shadow-none active:bg-/black-reward.avif hover:bg-/black-reward.avif active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                        >
                          Get Voucher
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Active Vouchers Section - with fixed width container */}
          <div className="w-full bg-white rounded-lg shadow-md border border-gray-800 my-4">
            {/* Header */}
            <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-black p-3">
              Your Active Vouchers
            </div>
            
            {/* Scrollable Container with fixed width */}
            <div className="w-full py-4 px-4">
              {/* This div ensures the container doesn't expand beyond its parent */}
              <div className="flex flex-wrap pb-2">
                {activeVouchers.length > 0 ? (
                  activeVouchers.map((voucher, index) => (
                    <div 
                      key={index} 
                      className="w-64 bg-gradient-to-br from-gray-200 to-white border border-yellow-600/30 rounded-lg shadow-lg hover:shadow-yellow-600/10 transition-shadow duration-300 my-2 mr-4"
                    >
                      <div className="p-4 flex flex-col items-center">
                        <div className="bg-gray-800 rounded-full p-3 mb-3 border border-yellow-600/30">
                          <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/035/321/940/small_2x/discount-coupon-voucher-with-percent-symbol-3d-rendering-icon-illustration-concept-isolated-png.png"
                            alt="voucher"
                            className="h-20 w-20 object-contain"
                          />
                        </div>
                        <p className="text-black text-lg font-semibold text-center">
                          {toTitleCase(voucher.name)}
                        </p>
                        <div className="bg-yellow-600 text-black px-4 py-1 rounded-full mt-2 font-bold">
                          {voucher.discountType === "percentage" ? `${voucher.discountValue}% OFF` : `₹${voucher.discountValue} OFF`}
                        </div>
                        <p className="text-gray-400 text-sm mt-3 text-center">
                          Valid until: {new Date(new Date(voucher.issuedDate).setFullYear(new Date(voucher.issuedDate).getFullYear() + 1)).toLocaleDateString()}
                        </p>
                        <div className="mt-3 text-center bg-gray-800 w-full px-3 py-2 rounded-md text-xs font-medium text-gray-200 border border-dashed border-yellow-600/30">
                          Code: <span className="font-bold text-yellow-600">{voucher.name || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-8 px-4 text-gray-400">
                    <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-center">You don't have any active vouchers yet</p>
                    <p className="text-center text-sm mt-1">Redeem your points to get exclusive offers!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

         {/* Transaction History Section */}
          <div className="w-full max-w-full bg-white rounded-lg shadow-md border border-gray-800 my-4">
            {/* Header */}
            <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-black p-3">
              Reward Transaction History
            </div>
            
            {/* Transaction Table */}
            <div className="w-full p-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600"></div>
                </div>
              ) : transactionHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto divide-y divide-gray-800">
                    <thead className="bg-gray-100 border border-1 border-black">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-100 divide-y divide-gray-800">
                      {transactionHistory.map((transaction, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                            {transaction.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : (transaction.status === 'completed' ? 'bg-green-900 text-green-200' :'bg-red-900 text-red-200' )
                            }`}>
                              {transaction.status === "completed" ? "credited" :transaction.status}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.transactionType === 'earned' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.transactionType === 'earned' ? '+' : '-'}{transaction.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-8 px-4 text-gray-400">
                  <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-center">No transaction history found</p>
                  <p className="text-center text-sm mt-1">Your reward activity will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section for logged in users */}
          <FAQSection />

        </div>
      ) : ( 
        // REWARDS FAQ SECTION FOR NON-LOGGED IN USERS
        <>
        <WeDoMore  />
        <div className="flex relative text-black  pb-28 px-3 md:px-8 bg-white min-h-screen lg:px-32 pt-5 md:pt-10">
          

          <div className="flex flex-col md:flex-row justify-center h-full lg:items-start mt-10">
            <div className="md:w-1/3 flex flex-col gap-3">
              {/* <p className="lg:text-6xl mb-6 text-4xl text-yellow-600 font-bold text-start">
                Rewards
              </p> */}
              <p className="text-lg">
                Learn about our rewards program and how you can earn points to redeem exclusive vouchers and discounts.
              </p>
            </div>
            <div className="md:w-2/3 md:pl-8 mt-8 md:mt-0">
              {faqData && faqData.length > 0 ? (
                faqData.map((faq, index) => {
                  const prefix = "Frequently Asked Questions (FAQs) – Property Tax – Gurgaon";
                  const cleanContent = faq.content.startsWith(prefix)
                    ? faq.content.slice(prefix.length).trim()
                    : faq.content.trim();

                  // Check if cleanContent contains HTML
                  const isHTML = /<[^>]+>/.test(cleanContent);
                  let sanitizedContent;

                  if (isHTML) {
                    // If it's already HTML, just sanitize it
                    sanitizedContent = DOMPurify.sanitize(cleanContent);
                  } else {
                    // If it's plain text, replace links and then sanitize
                    const formattedContent = cleanContent.replace(
                      /(https?:\/\/[^\s]+)/g,
                      '<a href="$1" target="_blank" class="text-yellow-600 underline">$1</a>'
                    );
                    sanitizedContent = DOMPurify.sanitize(formattedContent);
                  }

                  // Add styles to existing links if any
                  sanitizedContent = sanitizedContent.replace(
                    /<a /g,
                    '<a class="text-yellow-600 underline" '
                  );

                  return (
                    <div
                      key={index}
                      className={`my-4 transition-all duration-300 ease-in-out ${
                        openIndex === index
                          ? "border-[1px] border-black bg-gray-100 max-h-[300px] overflow-y-scroll"
                          : "border-[1px] border-black"
                      } p-4 hover:scale-105 transition-all`}
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleFAQ(index)}
                      >
                        <h3 className="md:text-lg text-base font-medium">
                          {faq.title}
                        </h3>
                        <div className="text-xl text-black">
                          {openIndex === index ? <FiMinus /> : <FiPlus />}
                        </div>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openIndex === index ? "mt-4" : "max-h-0"
                        }`}
                      >
                        <hr className="border-t-[2px] border-black mb-4" />
                        <p
                          className="mt-7"
                          dangerouslySetInnerHTML={{
                            __html: sanitizedContent,
                          }}
                        ></p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center text-gray-400">
                    <p className="text-xl font-medium mb-2">Loading FAQs...</p>
                    <p>Please wait while we fetch the rewards information.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
}