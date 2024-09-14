import Table from '../Comps/Tables/Table'

const LoanAgreement = [
    { id: 1, name: 'Whatsapp.img123123', size: '345kb', date: '22/03/2024' },
    { id: 2, name: 'Whatsapp.img123123', size: '324mb', date: '24/03/2024' },
    { id: 3, name: 'Whatsapp.img123123', size: '324mb', date: '24/03/2024' },
];


export default function RecentUpdate() {
    return (
        <>
            <div className="flex flex-col mt-6 mx-4" >
                <Table tablename={"Recent Updates"} tableData={LoanAgreement} />
            </div>
        </>
    )
}