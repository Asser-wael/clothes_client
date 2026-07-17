import React from "react";
import { FaUserClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";

export default function WaitingAdmin() {
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] p-6">
            <div className="bg-[var(--color-card)] border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">

                <div className="flex justify-center mb-4">
                    <FaUserClock className="text-5xl text-[var(--color-accent)] animate-pulse" />
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    Waiting for Admin Approval
                </h1>

                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                    Your account is currently under review.
                    Please wait until an admin approves your access.
                </p>

                <div className="mt-6 inline-block px-4 py-2 rounded-full text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                    Pending Approval
                </div>

                <button
                    onClick={async () => {
                        try {
                            await dispatch(logoutUser()).unwrap();
                            window.location.reload();
                            navigate("/");
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    className="mt-6 w-full py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}