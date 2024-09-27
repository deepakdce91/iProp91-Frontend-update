import { Link, useNavigate } from "react-router-dom"
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton"
import { useEffect } from "react"

export default function AskForLogin() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/concierge");
        }
    }, [navigate]);


    return (
        <div>
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4 text-nowrap max-lg:!text-3xl">Welcome to Iprop 91</h1>
                <p className="text-gray-500 mb-8">
                    Your all in one Prop tech platform
                </p>
                <div className="w-72">
                    <Link to="/authenticate">
                        <Goldbutton
                            btnname={"Authenticate to Continue.."}
                            bgcolor={""}
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}