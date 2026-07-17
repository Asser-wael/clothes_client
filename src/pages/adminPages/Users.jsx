import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser, changeStatus } from "../../features/usersSlice";
import { motion } from "framer-motion";
import { TiUserDeleteOutline } from "react-icons/ti";
import Forbidden from "../../components/forbidden";

export default function Users() {
  const dispatch = useDispatch();
  const { usersData, loadingUsers, loadingDelete, loadingStatus } = useSelector(
    (state) => state.usersSlice
  );

  // search ///////////////////////////////
  const [search, setSearch] = useState("");
  const filteredUsers = usersData?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const { userData: user, isLoading } = useSelector(
    (state) => state.authSlice
  );


  if (user.role === "chef" || user.role === "cashier") {
    return <Forbidden />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, }}
      animate={{ opacity: 1, }}
      className="p-6 w-full text-[var(--color-text)]">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-[var(--color-muted)] text-sm">
          Manage all system users
        </p>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3 w-full md:w-1/3 px-4 py-2 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* LOADING */}

      {loadingUsers && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[var(--color-card)] animate-pulse rounded-xl"
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loadingUsers && usersData?.length === 0 && (
        <div className="text-center text-[var(--color-muted)] mt-10">
          No users found
        </div>
      )}

      {/* USERS LIST */}
      <div className="space-y-3 ">
        {!loadingUsers && filteredUsers?.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-card)] hover:shadow-md transition flex-wrap gap-4"
          >
            {/* LEFT */}
            <div className="flex flex-col">
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-[var(--color-muted)] break-all">
                {user.email}
              </p>
            </div>

            {/* change status */}

            <div className=" flex justify-center items-center gap-6  flex-wrap">
              <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                {user.role}
              </span>
              <select
                disabled={loadingStatus || (user.role === "admin" && user.status === true)}
                value={String(user.status)}
                onChange={(e) =>
                  dispatch(
                    changeStatus({
                      id: user._id,
                      status: e.target.value === "true",
                    })
                  )
                }

                className="px-3 py-2 bg-card border disabled:opacity-50 disabled:cursor-not-allowed border-border rounded-xl cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {/* DELETE */}
              <button
                disabled={loadingDelete || (user.role === "admin" && user.status)}
                onClick={() => dispatch(deleteUser(user._id))}

                disabled={loadingDelete}
                className="text-red-500 hover:text-red-700 transition cursor-pointer disabled:opacity-50"
              >
                <TiUserDeleteOutline className="text-2xl" />
              </button>

              {/* status */}
              <div
                className={`w-3 h-3 rounded-full animate-pulse  ${user.status
                  ? "bg-green-500 shadow-[0_0_10px_#22c55e]"
                  : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                  }`}
              ></div>

            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}