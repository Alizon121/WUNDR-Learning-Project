import { useState } from "react"
import JoinChild from "../joinChild/JoinChild"

const Profile = () => {
    const [tabIdx, setTabIdx] = useState<number>(0)
    const profileTabs = ['User Information', "Child's Information"]

    return (
        <div className="flex flex-row">
            <div className="w-1/4">{profileTabs.map((tab, idx) => (
                <div key={idx} className={`${idx === tabIdx ? 'active' : ""}`} onClick={() => setTabIdx(idx)}>{tab}</div>
            ))}
            </div>

            <div className="w-3/4">
                {tabIdx === 1 && <JoinChild />}
            </div>
        </div>
    )
}

export default Profile
