'use client'

import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        // Можно сразу брать firstName, или user целиком из localStorage
        const user = localStorage.getItem("user");
        if (user) {
            const userObj = JSON.parse(user);
            setFirstName(userObj.firstName);
        }
    }, []);

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow text-center">
            <h2 className="text-2xl font-bold mb-4">
                Hello, {firstName ? firstName : "друг"}! 👋
            </h2>
            {/* Здесь потом появится информация о профиле */}
            <div className="text-gray-600">Welcome to  WonderHood!</div>
        </div>
    );
}
