import Addpropform from "./Comps/addpropform"
import Header from "./Comps/NameHeader"
export default function AddProperty() {
    return (
        <>
            <div className="w-full bg-white/90 rounded-xl min-h-screen">
                <Header/>
                <Addpropform />
            </div>
        </>
    )
}