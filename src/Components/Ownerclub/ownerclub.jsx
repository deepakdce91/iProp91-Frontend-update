import { jwtDecode } from "jwt-decode";
import ChatScreen from "./ChatArea/ChatScreen"
import { useEffect, useState } from "react";
export default function OwnerClub(){

    const [userId, setUserId] = useState();
    const [userToken, setUserToken] = useState();
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
      }, []);
    return (
        <>
        <div className="min-h-screen w-full bg-white">
            <div className="flex h-full w-full px-5 py-2 bg-black" >
                <ChatScreen userId={userId} userToken={userToken} />
            </div>
        </div>
        </>
    )
}