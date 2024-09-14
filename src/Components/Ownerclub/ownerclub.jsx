import List from "./List/List"
import Chat from "./ChatArea/Chat"
export default function OwnerClub(){
    return (
        <>
        <div className="h-[100vh] ">
            <div className="flex h-full w-full" >
                <div className="xl:w-[550px] w-full bg-white  overflow-y-scroll no-scrollbar">
                    <List/>
                </div>
                <div className=" w-full hidden xl:!block ">
                    <Chat/>
                </div>
            </div>
        </div>
        </>
    )
}