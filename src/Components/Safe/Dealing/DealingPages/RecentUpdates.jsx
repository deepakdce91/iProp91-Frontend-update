import { useEffect } from 'react';
import Table from '../Comps/Tables/Table'
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RecentUpdate({data,safeid}) {
    const [recentdata, setRecentData] = useState([]);

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
                body: JSON.stringify({ recentUpdates: recentdata })
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
        setRecentData(data.data.recentUpdates);
        console.log("RecentUpdate",recentdata);
    }, []);

    useEffect(() => {
        UpdateSafe();
    }, [recentdata]);
   
    return (
        <>
            <div className="flex flex-col mt-6 mx-4" >
                <Table tablename={"Recent Updates"} tableData={recentdata} setdata={setRecentData} />
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </>
    )
}