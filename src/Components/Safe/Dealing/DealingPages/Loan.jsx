import Table from "../../../CompoCards/Tables/Table";


export default function Loan() {

  const tables = [
    {name: "Loan Agreement", category: "loanAgreement"},
    {name: "Payment Plan", category: "paymentPlanLoan"}
  ]
  
  return (
    <>
      <div className="flex flex-col mt-6 mx-4">
        {tables.map((table, index) => (
          <Table key={index} tablename={table.name} category={table.category} />
        ))}
      </div>
    </>
  );
}
