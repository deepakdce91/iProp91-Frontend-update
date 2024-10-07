import Table from '../../../CompoCards/Tables/Table'




export default function Rental() {

    const tables = [
        { name: "Rental Agreement /Extensions /Amendment Agreement", category: "rentAgreementOrExtensionsOrAmendmentAgreement" },
        { name: "Tenant KYC Documents", category: "tenantKycDocuments" },
        { name: "Rent Receipts", category: "rentReceipt" }
    ]
    return (
        <>
            <div className="flex flex-col mt-6 mx-4">
                {tables.map((table, index) => (
                    <Table key={index} tablename={table.name} category={table.category} />
                ))}
            </div>
        </>
    )
}