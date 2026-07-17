import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

import "./App.css";

import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

// جوه الـ return:
import Loading from "./components/loading";
import Popup from "./components/Popup";
import SoundPlayer from "./components/SoundPlayer";
import Toast from "./components/Toast";
import WaitingAdmin from "./components/waitingAdmin";

import status from "./assets/status.mp3";

import { socket } from "./services/socket";

import { getUser } from "./features/authSlice";
import { setNotification } from "./features/notificationSlice";
import { getAdminOrders, updateTracking } from "./features/orderSlice";
import { show } from "./features/soundNotificationSlice";

const playStatusSound = () => {
  new Audio(status).play().catch(() => { });
};

const showLowStockToast = (data) => {
  toast.custom((t) => (
    <div
      className={`
      ${t.visible ? "animate-in slide-in-from-right" : "animate-out slide-out-to-right"}
      w-[380px]
      rounded-xl
      border border-yellow-300
      bg-[var(--color-card)]
      p-4
      shadow-xl
      flex items-start gap-3
      `}
    >
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
        <FiAlertTriangle className="text-xl text-yellow-600" />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-[var(--color-text)]">
          Low Stock Warning
        </p>

        <p className="mt-1 text-sm text-[var(--color-muted)]">
          <span className="font-bold text-yellow-600">
            {data.count}
          </span>{" "}
          items remaining for{" "}
          <span className="font-semibold">
            {data.name}
          </span>{" "}
          ({data.size})
        </p>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-gray-400 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  ));
};

export default function App() {
  const dispatch = useDispatch();

  const { userData: user } = useSelector(
    (state) => state.authSlice
  );

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // انضمام العملاء لغرف تتبع الطلبات المخزنة محلياً عند تشغيل التطبيق
  useEffect(() => {
    const tracking =
      JSON.parse(localStorage.getItem("orderTracking")) || [];

    tracking.forEach((order) => {
      socket.emit("join-order", order.orderId);
    });
  }, []);

  // الاستماع لتحديثات حالة الطلب عبر السوكت للعملاء
  useEffect(() => {
    const handleOrderStatus = async (data) => {
      try {
        let tracking =
          JSON.parse(localStorage.getItem("orderTracking")) || [];

        const exists = tracking.find(
          (o) => o.orderId === data.orderId
        );

        if (!exists) return;

        dispatch(
          updateTracking({
            orderId: data.orderId,
            status: data.status,
          })
        );

        tracking = tracking.map((order) =>
          order.orderId === data.orderId
            ? { ...order, status: data.status }
            : order
        );

        localStorage.setItem(
          "orderTracking",
          JSON.stringify(tracking)
        );

        dispatch(
          setNotification({
            message: `Your order is now ${data.status}`,
            type: "success",
          })
        );

        playStatusSound();

        if (
          data.status === "completed" ||
          data.status === "cancelled"
        ) {
          localStorage.removeItem("orderTracking");
        }
      } catch (err) {
        console.error(err);
      }
    };

    socket.off("order-status-updated");
    socket.on("order-status-updated", handleOrderStatus);

    return () => {
      socket.off(
        "order-status-updated",
        handleOrderStatus
      );
    };
  }, [dispatch]);

  // إدارة غرف الأدمن واستقبال الطلبات الجديدة وتنبيهات نقص المخزون عبر السوكت
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return;

    socket.emit("joinAdminRoom");

    const handleNewOrder = async (order) => {
      await dispatch(getAdminOrders());

      dispatch(
        show({
          message: `New Order - ${order.shippingAddress.fullName}`,
        })
      );
    };

    const handleWarning = (data) => {
      showLowStockToast(data);
    };

    socket.off("newOrder");
    socket.off("warning");
    socket.on("newOrder", handleNewOrder);
    socket.on("warning", handleWarning);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("warning", handleWarning);
    };
  }, [dispatch]);

  if (user && user.status === false) {
    return <WaitingAdmin />;
  }

  return (
    <>
      <Toaster  position="top-center" />
      <Toast />
      <SoundPlayer />
      <Popup />

      <Suspense fallback={<Loading />}>
        <RouterProvider router={AppRoutes} />
      </Suspense>
    </>
  );
}