import NameHeader from "../../CompoCards/Header/NameHeader"
import ListCard from "./ListCard/ListCard"

let MessageList = [
    {
        name: "Jane Smith",
        message: "Hey there!",
        time: "11:30 AM",
        unread: 1
    },
    {
        name: "Mike Johnson",
        message: "What's up?",
        time: "12:45 PM",
        unread: 0
    },
    {
        name: "Emily Davis",
        message: "How's it going?",
        time: "2:15 PM",
        unread: 3
    },
    // Add more objects here...
    {
        name: "Alex Wilson",
        message: "Nice to meet you!",
        time: "5:30 PM",
        unread: 2
    },
    // Add more objects here...
    {
        name: "Jane Smith",
        message: "Hey there!",
        time: "11:30 AM",
        unread: 1
    },
    {
        name: "Mike Johnson",
        message: "What's up?",
        time: "12:45 PM",
        unread: 0
    },
    {
        name: "Emily Davis",
        message: "How's it going?",
        time: "2:15 PM",
        unread: 3
    },
    // Add more objects here...
    {
        name: "Alex Wilson",
        message: "Nice to meet you!",
        time: "5:30 PM",
        unread: 2
    },
    // Add more objects here...
    {
        name: "Jane Smith",
        message: "Hey there!",
        time: "11:30 AM",
        unread: 1
    },
    {
        name: "Mike Johnson",
        message: "What's up?",
        time: "12:45 PM",
        unread: 0
    },
    {
        name: "Emily Davis",
        message: "How's it going?",
        time: "2:15 PM",
        unread: 3
    },
    // Add more objects here...
    {
        name: "Alex Wilson",
        message: "Nice to meet you!",
        time: "5:30 PM",
        unread: 2
    },
    // Add more objects here...
    {
        name: "Jane Smith",
        message: "Hey there!",
        time: "11:30 AM",
        unread: 1
    },
    {
        name: "Mike Johnson",
        message: "What's up?",
        time: "12:45 PM",
        unread: 0
    },
    {
        name: "Emily Davis",
        message: "How's it going?",
        time: "2:15 PM",
        unread: 3
    },
    // Add more objects here...
    {
        name: "Alex Wilson",
        message: "Nice to meet you!",
        time: "5:30 PM",
        unread: 2
    },
    // Add more objects here...
    {
        name: "Jane Smith",
        message: "Hey there!",
        time: "11:30 AM",
        unread: 1
    },
    {
        name: "Mike Johnson",
        message: "What's up?",
        time: "12:45 PM",
        unread: 0
    },
    {
        name: "Emily Davis",
        message: "How's it going?",
        time: "2:15 PM",
        unread: 3
    },
    // Add more objects here...
    {
        name: "Alex Wilson",
        message: "Nice to meet you!",
        time: "5:30 PM",
        unread: 2
    },
    // Add more objects here...
    {
        name: "Jane Smith",
        message: "Hey there!",
        time: "11:30 AM",
        unread: 1
    },
    {
        name: "Mike Johnson",
        message: "What's up?",
        time: "12:45 PM",
        unread: 0
    },
    {
        name: "Emily Davis",
        message: "How's it going?",
        time: "2:15 PM",
        unread: 3
    },
    // Add more objects here...
    {
        name: "Alex Wilson",
        message: "Nice to meet you!",
        time: "5:30 PM",
        unread: 2
    }
    // Add more objects here...
];



export default function List() {
    return (
        <>
            <div className="w-full flex flex-col ">
                <div className="bg-white p-2 relative top-0 sticky">
                    <div className="m-2">
                        <NameHeader firstname="iProp91" secondname="Family" />
                    </div>
                    <div className="my-2">
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" class="block w-full p-4 ps-10 text-md text-black border border-gray-300 rounded-lg " placeholder="Search" required />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col p-2">
                    {MessageList.map((message, index) => (
                        <ListCard
                            key={index}
                            name={message.name}
                            message={message.message}
                            time={message.time}
                            unread={message.unread}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}