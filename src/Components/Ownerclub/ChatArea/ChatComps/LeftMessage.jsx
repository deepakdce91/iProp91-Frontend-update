import { FaPaperclip } from 'react-icons/fa';

export default function DocLeftMessage({ img, text, name, video, audio, doc }) {
    return (
        <>
            <div className="flex space-x-3 p-3">
                <div className="w-10 h-10 rounded-full overflow-hidden max-w-lg">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-2">
                        <img src="./images/1.png" alt="" />
                    </div>
                </div>
                <div className="border rounded-lg p-2 w-4/6 sm:max-w-lg bg-[#fdfafb]">
                    <div className="text-primary font-bold">{name}</div>
                    {video && <video src={video} controls className="rounded-lg my-1 w-full" />}
                    {audio && <audio src={audio} controls className="rounded-lg my-1 w-full" />}
                    {doc && (
                        <a href={doc} target="_blank" rel="noreferrer" className="flex flex-row p-2 rounded-lg bg-gray-800">
                            <FaPaperclip className="text-gray-400 text-xl cursor-pointer mr-3" />
                            <div className="text-white">Document</div>
                        </a>
                    )}
                    {img && (
                        <a href={img} target="_blank" rel="noreferrer">
                            <img src={img} alt="" className="rounded-lg my-1 w-full" />
                        </a>
                    )}
                    <div className="text-black">{text}</div>
                </div>
            </div>
        </>
    );
}