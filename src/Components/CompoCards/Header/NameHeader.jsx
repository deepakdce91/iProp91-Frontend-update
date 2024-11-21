export default function NameHeader({firstname,secondname}){
    return (
        <>
        <div className="w-full ">
            <div className="flex h-full items-center">
                <div className="flex flex-col items-center">
                    <div className="text-white text-[26px] font-semibold m-1">{firstname}</div>
                    <div className="h-[3px] bg-gold w-[80%]"></div>
                </div>
                <div className="flex flex-col">
                    <div className="text-primary text-[26px]  font-semibold m-1">{secondname}</div>
                    <div className="h-[3px] "></div>
                </div>
            </div>
        </div>
        </>
    )
}