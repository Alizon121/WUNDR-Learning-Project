'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";

import JoinChild from "./childInfo/JoinChild"
import UserInfo from "./userInfo/UserInfo"
import Notifications from "./notifications/NotifInfo"

type TabKey = 'user' | 'child' | 'events' | 'notifications';

const profileTabs = ['User Information', "Child's Information", 'Your Events', 'Notifications'] as const;
const keyToIdx: Record<TabKey, number> = { user: 0, child: 1, events: 2, notifications: 3 };
const idxToKey = (idx: number): TabKey =>
  (['user', 'child', 'events', 'notifications'] as TabKey[])[idx];

const Profile = () => {
    // const [tabIdx, setTabIdx] = useState<number>(0)
    const router = useRouter();
    // const profileTabs = ['User Information', "Child's Information", "Your Events", "Notifications"]
    const searchParams = useSearchParams();

    const initialKey = (searchParams.get('tab') ?? 'user') as TabKey;
    const [tabIdx, setTabIdx] = useState<number>(() => keyToIdx[initialKey] ?? 0);

    const openTab = (idx: number) => {
        setTabIdx(idx);
        router.replace(`/profile?tab=${idxToKey(idx)}`);
    };


    return (
        <div className="flex flex-row bg-wonderbg">
            {/* Left menu */}
            <div className="w-1/4">
            {profileTabs.map((tab, idx) => (
                <div key={idx} className={`${idx === tabIdx ? 'active' : ""}`} onClick={() => setTabIdx(idx)}>{tab}</div>
            ))}
            </div>

            <div className="w-3/4">
                {tabIdx === 0 && <UserInfo />}
                {tabIdx === 1 && <JoinChild />}
                {tabIdx === 3 && <Notifications />}
            </div>
        </div>
    )
}

export default Profile
