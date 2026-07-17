import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../features/orderSlice";
import Loading from "../../components/loading";

import { IoClose } from "react-icons/io5";

const STATUS_OPTIONS = ["pending", "accepted", "preparing", "shipped", "completed", "cancelled"]


export default function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { order, loading } = useSelector(
        (state) => state.orderSlice
    );

    const [status, setStatus] = useState("");
    const [img, setimg] = useState(null);

    useEffect(() => {
        dispatch(getOrderById(id));

    }, [id, dispatch]);

    useEffect(() => {
        if (order?.status) {
            setStatus(order.status);
        }
    }, [order]);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;


        setStatus(newStatus);

        // update backend
        dispatch(updateOrderStatus({ id, status: newStatus }));
    };

    if (img) {
        return (
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lg">
                <img
                    src={img}
                    alt="Preview"
                    className="w-full rounded-xl object-cover"
                />

                <button
                    onClick={() => setimg(null)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-all duration-200 hover:rotate-90 hover:scale-110"
                >
                    <IoClose size={22} />
                </button>
            </div>
        );
    }
    if (loading || !order) {
        return <Loading />;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto text-[var(--color-text)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">
                    Order #{order._id.slice(-6)}
                </h1>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 rounded-lg text-sm"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm rounded-xl p-5 space-y-4">

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-[var(--color-muted)]">Payment method</p>
                        <p className="font-semibold">{order.paymentMethod}</p>
                    </div>

                    <div>
                        <p className="text-[var(--color-muted)]">Status</p>
                        <p className="font-semibold text-[var(--color-accent)]">
                            {order.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-[var(--color-muted)]">Order time</p>
                        <p className="font-semibold">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-[var(--color-muted)]">Last updated</p>
                        <p className="font-semibold">
                            {new Date(order.updatedAt).toLocaleString()}
                        </p>
                    </div>

                    {order.paymentMethod === "wallet" && (
                        <>
                            <div>
                                <p className="text-[var(--color-muted)]">Wallet name</p>
                                <p className="font-semibold">
                                    {order.walletName}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--color-muted)]">Wallet number</p>
                                <p className="font-semibold">
                                    {order.walletNumber}
                                </p>
                            </div>
                            <div>
                                <p className="text-[var(--color-muted)]">Wallet type</p>
                                <p className="font-semibold">
                                    {order.walletType}
                                </p>
                            </div>
                            {order.image && (
                                <div className="cursor-pointer" onClick={() => setimg(`${import.meta.env.VITE_API_URL}/uploads/${order.image}`)}>
                                    <p className="text-[var(--color-muted)]">Payment proof</p>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${order.image}`}
                                        alt=""
                                        className="mt-1 h-20 w-20 rounded-lg object-cover border border-[var(--color-border)]"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Shipping address */}
                <div className="border-t border-[var(--color-border)] pt-4">
                    <h2 className="font-bold mb-3">Shipping address</h2>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-[var(--color-muted)]">Full name</p>
                            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-[var(--color-muted)]">Phone</p>
                            <p className="font-semibold">{order.shippingAddress?.phone}</p>
                        </div>
                        <div>
                            <p className="text-[var(--color-muted)]">City</p>
                            <p className="font-semibold">{order.shippingAddress?.city}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[var(--color-muted)]">Address</p>
                            <p className="font-semibold">{order.shippingAddress?.address}</p>
                        </div>
                        {order.shippingAddress?.notes && (
                            <div className="col-span-2">
                                <p className="text-[var(--color-muted)]">Notes</p>
                                <p className="font-semibold">{order.shippingAddress.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="border-t border-[var(--color-border)] pt-4">
                    <h2 className="font-bold mb-3">Items</h2>

                    <div className="border-t border-[var(--color-border)] pt-5">
                        <h2 className="mb-4 text-xl font-bold">Order Items</h2>

                        <div className="space-y-4">
                            {order.cart?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:flex-row md:items-center"
                                >
                                    {/* Image */}
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                                        alt={item.name}
                                        className="h-24 w-24 rounded-xl object-cover border border-[var(--color-border)]"
                                    />

                                    {/* Details */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold">
                                            {item.name}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                                            <span className="rounded-full bg-[var(--color-card)] px-3 py-1">
                                                Size: <b>{item.size}</b>
                                            </span>

                                            {item.color && (
                                                <span className="rounded-full bg-[var(--color-card)] px-3 py-1">
                                                    Color: <b>{item.color}</b>
                                                </span>
                                            )}

                                            <span className="rounded-full bg-[var(--color-card)] px-3 py-1">
                                                Qty: <b>{item.count}</b>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-sm text-[var(--color-muted)]">
                                            Unit Price
                                        </p>

                                        <p className="text-lg font-bold">
                                            {item.price} L.E
                                        </p>

                                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                                            Total
                                        </p>

                                        <p className="text-xl font-extrabold text-[var(--color-accent)]">
                                            {item.price * item.count} L.E
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="text-right text-xl font-bold border-t border-[var(--color-border)] pt-3">
                    Total: {order.totalPrice} L.E
                </div>
            </div>
        </div>
    );
}