import { jwtDecode } from "jwt-decode";
import ChatScreen from "./ChatArea/ChatScreen"
import { useEffect, useState } from "react";

export default function OwnerClub() {
    const [userId, setUserId] = useState();
    const [userToken, setUserToken] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        try {
            let token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode(token);
                setUserId(decoded.userId);
                setUserToken(token);
            }
        } catch (error) {
            console.log(error);
        }

        // Check for modal info with expiration
        const modalInfo = localStorage.getItem("modalInfo");
        if (modalInfo) {
            const { message, route, expiry } = JSON.parse(modalInfo);
            if (route === "/family" && Date.now() < expiry) {
                setModalMessage(message);
                setShowModal(true);
                localStorage.removeItem("modalInfo"); // Clear the modal info
            }
        }
    }, []);

    return (
        <>
            <div className="min-h-screen w-full">
                <div className="flex h-full w-full bg-black">
                    <ChatScreen userId={userId} userToken={userToken} />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Property Status</h3>
                        <p className="mb-4">{modalMessage}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}