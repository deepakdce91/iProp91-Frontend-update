import { Link } from "react-router-dom"
import Goldbutton from "../CompoCards/GoldButton/Goldbutton"
export default function AskForLogin() {
    return (
        <div>
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Iprop 91</h1>
                <p className="text-gray-500 mb-8">
                    Your all in one Prop tech platform
                </p>
                <div className="w-72">
                    <Link to="/signup">
                        <Goldbutton
                            btnname={"Sign up"}
                            bgcolor={"bg-gray-200"}
                        />
                    </Link>
                </div><br />
                <div className="w-72">
                    <Link to="/login">
                        <Goldbutton
                            btnname={"Login"}
                            bgcolor={"bg-gold"}
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}