import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Loading from "../components/loading.jsx";
import { getUser } from "../features/authSlice";

const PublicRoute = ({ children }) => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getUser());
  // }, [dispatch]);

  const { userData: user, isLoading } = useSelector(
    (state) => state.authSlice
  );

  if (isLoading) return <Loading />;

  if (user) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;

      case "cashier":
        return <Navigate to="/admin/order" replace />;

      case "chef":
        return <Navigate to="/admin/kitchen" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;