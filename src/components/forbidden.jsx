import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineNoAccounts } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

export default function Forbidden() {
    return (
        <motion.div
            initial={{ opacity: 0  , y : -20}}
            animate={{ opacity: 1 , y : 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-bg text-text flex items-center justify-center px-6">
            <div className="w-full max-w-2xl">
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
                            <MdOutlineNoAccounts className="text-accent text-5xl" />
                        </div>
                    </div>

                    <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent font-semibold mb-4">
                        Error 403
                    </span>

                    <h1 className="text-4xl font-extrabold mb-4">
                        Access Denied
                    </h1>

                    <p className="text-muted text-lg mb-8">
                        You don't have permission to access this page.
                        This area may be restricted to administrators or authorized staff only.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
                        >
                            <HiOutlineHome size={20} />
                            Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 border border-border px-6 py-3 rounded-xl font-medium hover:bg-bg transition"
                        >
                            <IoArrowBackOutline size={20} />
                            Go Back
                        </button>
                    </div>
                </div>

                <p className="text-center text-muted mt-5 text-sm">
                    Restaurant Management System • Secure Access
                </p>
            </div>
        </motion.div>
    );
}