import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { sendResetOtp, verifyOtp } from "../../rudex/store/authSlice";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loadingReset, loadingVerifyOtp } = useSelector(
    (state) => state.auth
  );

  const { register, handleSubmit } = useForm();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  // SEND OTP
  const sendOtpHandler = async (data) => {
    setError("");

    const result = await dispatch(sendResetOtp(data.email));

    if (result.payload?.message === "OTP sent") {
      setEmail(data.email);
      setStep(2);
    } else {
      setError("Failed to send OTP");
    }
  };

  // VERIFY OTP
  const verifyOtpHandler = async (data) => {
    setError("");

    const result = await dispatch(
      verifyOtp({
        email,
        otp: data.otp,
        newPassword: data.password,
      })
    );

    if (result.payload?.message === "Password updated") {
      alert("Password changed successfully");

      navigate("/login");
    } else {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit(
            step === 1 ? sendOtpHandler : verifyOtpHandler
          )}
          className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-5"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Reset Password
            </h2>

            <p className="text-zinc-400 mt-2">
              {step === 1
                ? "Enter your email"
                : "Enter OTP and new password"}
            </p>
          </div>

          {/* EMAIL */}
          {step === 1 && (
            <div className="relative">
              <span className="absolute left-3 top-4 text-zinc-500">
                <MdEmail />
              </span>

              <input
                type="email"
                placeholder="Email"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pl-10 rounded-xl"
                {...register("email")}
              />
            </div>
          )}

          {/* OTP */}
          {step === 2 && (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="OTP Code"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl"
                  {...register("otp")}
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-4 text-zinc-500">
                  <MdLockOutline />
                </span>

                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pl-10 rounded-xl"
                  {...register("password")}
                />
              </div>
            </>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loadingReset || loadingVerifyOtp}
            className="bg-green-600 py-3 rounded-xl text-white font-bold"
          >
            {step === 1
              ? loadingReset
                ? "Sending..."
                : "Send OTP"
              : loadingVerifyOtp
              ? "Verifying..."
              : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}