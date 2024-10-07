
import Table from '../../../CompoCards/Tables/Table';


export default function RecentUpdate() {
   
    return (
        <>
            <div className="flex flex-col mt-6 mx-4" >
                <Table key={"recentUpdates"} tablename={"Recent Updates"} category={"recentUpdates"}  />
            </div>

        </>
    )
}