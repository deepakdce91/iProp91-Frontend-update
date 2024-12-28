export default function NameHeader({firstname,secondname}){
    return (
        <>
        <div className="w-full ">
            <div className="flex h-full items-center">
                <div className="flex flex-col items-center">
                    <div className="text-primary text-[26px] font-semibold m-1">{firstname}</div>
                </div>
            </div>
        </div>
        </>
    )
}