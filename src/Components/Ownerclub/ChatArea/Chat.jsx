import ChatHeader from "./ChatComps/ChatHeader";
import MessageArea from "./ChatComps/MessageArea";
import SendMessage from "./ChatComps/SendMessage";

export default function Chat(){
    return (
        <>
        <div className=" w-full flex flex-col bg-white ">
            <ChatHeader/>
            <MessageArea/>
            <SendMessage/>
        </div>
        </>
    )
}