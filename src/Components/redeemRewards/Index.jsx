import { useEffect, useState } from "react";
import NameHeader from "../../Components/Concierge/Nameheader";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { BiSolidCoinStack } from "react-icons/bi";

function toTitleCase(str) {
  return str
    .split("_") // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join words with space
}

export default function FirstSafe() {
  const [redeemRewards, setRedeemRewards] = useState([]);
  const [rewardCount, setRewardCount] = useState(0);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);

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
      console.log(data);

      toast.success("Voucher added successfully");
      setChangeMade(!changeMade);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add voucher");
      // Handle errors - perhaps show an error message to the user
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/rewards/fetchRedemptionRewards?userId=${tokenid.userId}`,
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
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
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
    fetchUser();
  }, [changeMade]);

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

  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:gap-1 mt-20 md:mt-0">
        <NameHeader
          description={
            "Every point you earn brings you closer to amazing rewards. Trade them for vouchers and enjoy discounts and special offers!"
          }
          name={"Rewards"}
        />
        <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-[#AE93F4] p-2">
          You currently have{" "}
          <span className="underline mx-1">{rewardCount}</span> reward points{" "}
          <BiSolidCoinStack />
        </div>

        <div className="w-full flex-col bg-white flex items-center">
          {/* Rewards Section - keeping your original implementation */}
          <div className="flex-row flex flex-wrap my-6 shadow-sm border border-slate-200 rounded-lg w-full justify-center m-4">
            {redeemRewards.length > 0 &&
              redeemRewards.map((item, index) => {
                return (
                  <div key={index} className="w-64 border border-gray-200 rounded-lg m-3">
                    <div className="p-2.5 h-56 mx-2 my-2 overflow-hidden rounded-xl bg-clip-border">
                      <img
                        src="https://t4.ftcdn.net/jpg/05/19/11/19/360_F_519111981_p309NtNfZGdLonm8V88eipNs5Pw65oJl.jpg"
                        alt="card-image"
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-slate-800 text-xl font-semibold">
                          {toTitleCase(item.name)}
                        </p>
                        <p className="text-cyan-600 w-20 text-right text-lg font-semibold">
                          {item.amount}{" "}
                          {item.discountType === "percentage" ? "%" : null}
                        </p>
                      </div>
                      <p className="text-slate-600 leading-normal font-light">
                        {item.description}
                      </p>
                      <button
                        onClick={() => convertToVoucher(item.name, item.type)}
                        className="rounded-md w-full mt-6 bg-cyan-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-cyan-700 focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 my-4">
          {/* Header */}
          <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-[#AE93F4] p-3">
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
                    className="w-64 bg-gradient-to-br from-purple-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 my-2 mr-4"
                  >
                    <div className="p-4 flex flex-col items-center">
                      <div className="bg-purple-100 rounded-full p-3 mb-3">
                        <img
                          src="https://static.vecteezy.com/system/resources/thumbnails/035/321/940/small_2x/discount-coupon-voucher-with-percent-symbol-3d-rendering-icon-illustration-concept-isolated-png.png"
                          alt="voucher"
                          className="h-20 w-20 object-contain"
                        />
                      </div>
                      <p className="text-slate-800 text-lg font-semibold text-center">
                        {toTitleCase(voucher.name)}
                      </p>
                      <div className="bg-cyan-600 text-white px-4 py-1 rounded-full mt-2 font-bold">
                        {voucher.discountType === "percentage" ? `${voucher.discountValue}% OFF` : `₹${voucher.discountValue} OFF`}
                      </div>
                      <p className="text-slate-500 text-sm mt-3 text-center">
                        Valid until: {new Date(new Date(voucher.issuedDate).setFullYear(new Date(voucher.issuedDate).getFullYear() + 1)).toLocaleDateString()}
                      </p>
                      <div className="mt-3 text-center bg-gray-100 w-full px-3 py-2 rounded-md text-xs font-medium text-gray-800 border border-dashed border-gray-300">
                        Code: <span className="font-bold">{voucher.name || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-8 px-4 text-gray-500">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
<div className="w-full max-w-full bg-white rounded-lg shadow-sm border border-gray-200 my-4 mb-8">
  {/* Header */}
  <div className="w-full flex justify-center items-center text-center text-white font-semibold bg-[#AE93F4] p-3">
    Reward Transaction History
  </div>
  
  {/* Transaction Table */}
  <div className="w-full p-4">
    {isLoading ? (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#AE93F4]"></div>
      </div>
    ) : transactionHistory.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactionHistory.map((transaction, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.notes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.transactionType}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.transactionType === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.transactionType === 'earned' ? '+' : '-'}{transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="w-full flex flex-col items-center justify-center py-8 px-4 text-gray-500">
        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p className="text-center">No transaction history found</p>
        <p className="text-center text-sm mt-1">Your reward activity will appear here</p>
      </div>
    )}
  </div>
</div>
      </div>
    </>
  );
}