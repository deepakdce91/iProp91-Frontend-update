export default function ListCard({name, message, time, unread}) {
    // handleChatlink function make bg of the clicked chat link to gold and other to white
    const handleChatlink = (e) => {

        // Get all the chat links
        const chatlinks = document.querySelectorAll('.messagelink');

        // Remove bg-gold from all the chat links
        chatlinks.forEach(chatlink => {
            chatlink.classList.remove('border-gold');
        });

        // Add bg-gold to the clicked chat link
        e.currentTarget.classList.add('border-gold');
    }

    return (
        <>
            <div className="flex items-start w-full p-3 my-1 bg-white border-2 hover:bg-gold rounded-lg items-center messagelink" onClick={handleChatlink}>
                <div className="mr-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <img src="/images/1.png" alt="" />
                    </div>
                </div>
                <div className="flex flex-row justify-between w-full">
                    <div className="">
                        <div className="text-lg font-semibold text-gray-800">{name}</div>
                        <p className="text-sm text-gray-600 mt-1">{message.length<30? message:message.substr(0,30) + '...'}</p>
                    </div>
                    <div className="ml-3 flex flex-col " >
                        <div className="text-xs text-gray-500 m-1">{time}</div>
                        <div className="w-5 h-5 m-1 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">{unread}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
