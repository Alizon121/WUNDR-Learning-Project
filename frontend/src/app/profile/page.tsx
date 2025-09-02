'use client'

import { useEffect, useState } from "react";
import Profile from '../../components/profile/Profile'

export default function ProfilePage() {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const userObj = JSON.parse(user);
            setFirstName(userObj.firstName);
        }
    }, []);

    return (
        <div className="px-6 py-20 max-w-5xl md:max-w-7xl mx-auto bg-wonderbg min-h-screen">
            <Profile />
        </div>
    );
}
