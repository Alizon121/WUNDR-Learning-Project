import { useState } from "react"
import UserInfo from "./userInfo/UserInfo"
import ChildInfo from "./childInfo/ChildInfo"

const Profile = () => {
    const [tabIdx, setTabIdx] = useState<number>(0)
    const profileTabs = ['User Information', "Child's Information", "Your Events", "Notifications"]

    return (
        <div className="flex flex-row bg-wonderbg">
            <div className="w-1/4">{profileTabs.map((tab, idx) => (
                <div key={idx} className={`${idx === tabIdx ? 'active' : ""}`} onClick={() => setTabIdx(idx)}>{tab}</div>
            ))}
            </div>

            <div className="w-3/4">
                {tabIdx === 0 && <UserInfo />}
                {tabIdx === 1 && <ChildInfo />}
            </div>
        </div>
    )
}

export default Profile
