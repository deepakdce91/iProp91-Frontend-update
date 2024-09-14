export default function NameHeader({firstname,secondname}){
    return (
        <>
        <div className="w-full ">
            <div className="flex h-full items-center">
                <div className="flex flex-col">
                    <div className="text-black text-[20px] sm:text-[26px] lg:text-[36px] font-semibold m-1">{firstname}</div>
                </div>
                <div className="flex flex-col">
                    <div className="text-primary  text-[20px] sm:text-[26px] lg:text-[36px]  font-semibold m-1">{secondname}</div>
                </div>
            </div>
        </div>
        </>
    )
}