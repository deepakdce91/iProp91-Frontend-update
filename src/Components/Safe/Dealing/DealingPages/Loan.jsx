import Table from '../Comps/Tables/Table'
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoanAgreement = [
    { id: 1, name: 'Whatsapp.img123123', size: '345kb', date: '22/03/2024' },
    { id: 2, name: 'Whatsapp.img123123', size: '324mb', date: '24/03/2024' },
    { id: 3, name: 'Whatsapp.img123123', size: '324mb', date: '24/03/2024' },
];


export default function Loan({data,safeid}) {
    const [loanAgreement, setloanAgreement] = useState([]);
    const [paymentPlanLoan, setpaymentPlanLoan] = useState([]);
    // const [LoanHandbook, setLoanHandbook] = useState([]);

    const UpdateSafe = async () => {
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        try {
            const response = await fetch(`http://localhost:3300/api/documents/updatedocumentsafe/${safeid}?userId=${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ loanAgreement: loanAgreement, paymentPlanLoan: paymentPlanLoan })
            });
            if (response.ok) {
                const resdata = await response.json();
                console.log("isUpdated",resdata);
            }
        }
        catch (err) {
            toast.error("Error fetching data");
            console.log(err);
        }
    }

   
    useEffect(() => {
        setloanAgreement(data.data.loanAgreement);
        setpaymentPlanLoan(data.data.paymentPlanLoan);
        console.log("LoanAgreement",loanAgreement);
        console.log("paymentPlanLoan",paymentPlanLoan);
    }, []);

    
    useEffect(() => {
        UpdateSafe();
    }, [paymentPlanLoan,loanAgreement]);
    
   

    return (
        <>
            <div className="flex flex-col mt-6 mx-4">
                <Table tablename={"Loan Agreement"} tableData={loanAgreement} setdata={setloanAgreement} />
                <Table tablename={"Payment Plan"} tableData={paymentPlanLoan} setdata={setpaymentPlanLoan} />
                <Table tablename={"Loan Handbook"} tableData={LoanAgreement} />
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </>
    )
}