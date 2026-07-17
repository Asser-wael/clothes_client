import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { HiOutlineFire, HiOutlineViewGrid, HiOutlinePhotograph } from "react-icons/hi";
import { BiPackage } from "react-icons/bi";

import Loading from "../../components/loading";
import { setNotification } from "../../features/notificationSlice";
import { motion } from "framer-motion";

import {
  addNewCategory,
  getAllCategories,
  deleteCategory,
  addPopular,
  deletePopular,
  getPopularProducts,
} from "../../features/customuseSlice";

import { getAllProducts } from "../../features/productsSlice";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function Customuse() {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");

  const { categories, popularProducts } = useSelector((s) => s.customuseSlice);
  const { products, loadingProducts } = useSelector((s) => s.productsSlice);
  const {
    loadingCategories,
    loadingPopular,
    loadingCreateCategory,
    loadingDeleteCategory,
    loadingAddPopular,
    loadingDeletePopular,
  } = useSelector((s) => s.customuseSlice);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
    dispatch(getPopularProducts());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const exist = categories?.some((i) => i.name === data.name);
    if (!image)
      return dispatch(setNotification({ message: "Image is required", type: "error" }));
    if (exist)
      return dispatch(setNotification({ message: "Category already exists", type: "error" }));

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", image);

    const res = await dispatch(addNewCategory(formData));
    if (res.payload) {
      reset();
      setImage(null);
      setPreview(null);
      dispatch(getAllCategories());
    }
  };

  const handleDeleteCategory = async (id) => {
    await dispatch(deleteCategory(id));
    dispatch(getAllCategories());
  };

  const popularIds = popularProducts?.map((p) => p.id?._id);
  const popularList = products?.filter((p) => popularIds?.includes(p._id));
  const normalList = products?.filter((p) => !popularIds?.includes(p._id));

  const handleAddPopular = (id) =>
    dispatch(addPopular(id)).then(() => dispatch(getPopularProducts()));

  const handleRemovePopular = (id) =>
    dispatch(deletePopular(id)).then(() => dispatch(getPopularProducts()));

  const isLoading =
    loadingCategories ||
    loadingPopular ||
    loadingCreateCategory ||
    loadingDeleteCategory ||
    loadingAddPopular ||
    loadingDeletePopular ||
    loadingProducts;

  if (isLoading) return <Loading />;

  const tabs = [
    { key: "categories", label: "Categories", icon: <HiOutlineViewGrid size={16} />, count: categories?.length },
    { key: "popular", label: "Popular", icon: <HiOutlineFire size={16} />, count: popularList?.length },
    { key: "products", label: "All products", icon: <BiPackage size={16} />, count: normalList?.length },
  ];

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 text-[var(--color-text)] sm:px-5 sm:py-10 md:px-8">
      <div className="mb-8 border-b border-[var(--color-border)] pb-8">
        <h1 className="font-serif text-[26px] italic text-[var(--color-text)] sm:text-[32px] md:text-[38px]">
          Customise
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-muted)]">
          Manage categories, popular items, and products.
        </p>
      </div>

      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <motion.aside {...fadeUp} className="w-full shrink-0 lg:sticky lg:top-6 lg:w-72">
          <div className="border border-[var(--color-border)] p-4 sm:p-5">
            <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              New category
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] text-[var(--color-muted)]">
                  Category name
                </label>
                <input
                  {...register("name", { required: true })}
                  placeholder="e.g. Jackets"
                  className="w-full border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] text-[var(--color-muted)]">
                  Image
                </label>
                <label className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border border-dashed border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]">
                  {preview ? (
                    <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <HiOutlinePhotograph className="text-3xl text-[var(--color-muted)]" />
                      <span className="text-xs text-[var(--color-muted)]">Click to upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <button
                type="submit"
                className="w-full border border-[var(--color-text)] py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
              >
                Create category
              </button>
            </form>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--color-border)] border border-[var(--color-border)] lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
            {[
              { label: "Categories", value: categories?.length ?? 0 },
              { label: "Popular", value: popularList?.length ?? 0 },
              { label: "Products", value: normalList?.length ?? 0 },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 p-3 sm:p-4 lg:flex-row lg:justify-between">
                <span className="text-[18px] font-semibold text-[var(--color-accent)] sm:text-[20px]">{s.value}</span>
                <span className="text-[11px] text-[var(--color-muted)] sm:text-[12px]">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Main */}
        <div className="min-w-0 flex-1 w-full">
          <div className="mb-8 flex w-full gap-4 overflow-x-auto border-b border-[var(--color-border)] sm:w-fit sm:gap-6">
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`relative flex shrink-0 items-center gap-2 pb-3 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${
                    active ? "text-[var(--color-text)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="text-[11px] text-[var(--color-muted)]">({t.count ?? 0})</span>
                  {active && (
                    <span className="absolute -bottom-[1px] left-0 h-[1.5px] w-full bg-[var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === "categories" && (
            <motion.div {...fadeUp} className="grid grid-cols-2 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {categories?.map((cat) => (
                <div
                  key={cat._id}
                  className="group relative flex flex-col items-center bg-[var(--color-card)] p-4 text-center sm:p-5"
                >
                  {/*
                    FIX: زرار الحذف كان opacity-0 وبيظهر بالـ hover بس،
                    فكان مختفي تمامًا على الموبايل. دلوقتي ظاهر دايمًا
                    تحت md بخلفية بسيطة عشان يبان فوق الصورة، وبالـ hover
                    بس من md لفوق زي الأول.
                  */}
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg)]/80 text-[var(--color-muted)] opacity-100 backdrop-blur-sm transition-opacity hover:text-red-500 md:bg-transparent md:opacity-0 md:group-hover:opacity-100"
                    aria-label="Delete"
                  >
                    <FaTrash size={11} />
                  </button>

                  {cat.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${cat.image}`}
                      className="h-12 w-12 rounded-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 sm:h-14 sm:w-14"
                      alt={cat.name}
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg)] sm:h-14 sm:w-14">
                      <HiOutlinePhotograph className="text-2xl text-[var(--color-muted)]" />
                    </div>
                  )}

                  <p className="mt-3 line-clamp-1 text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--color-text)] sm:text-[13px]">
                    {cat.name}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "popular" && (
            <motion.div {...fadeUp}>
              {popularList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 border border-[var(--color-border)] px-4 py-16 text-center text-[var(--color-muted)] sm:py-20">
                  <HiOutlineFire className="text-4xl opacity-30" />
                  <p className="text-sm">No popular products yet. Add some from All products.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 xl:grid-cols-3">
                  {popularList?.map((item) => (
                    <div key={item._id} className="bg-[var(--color-card)]">
                      <div className="relative h-40 overflow-hidden sm:h-44">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                          className="h-full w-full object-cover"
                          alt={item.name}
                        />
                        <div className="absolute left-0 top-0 bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-bg)]">
                          Popular
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="mb-3 line-clamp-1 text-[14px] font-semibold">{item.name}</p>
                        <button
                          onClick={() => handleRemovePopular(item._id)}
                          className="flex w-full items-center justify-center gap-2 border border-[var(--color-border)] py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-red-500 transition-colors hover:border-red-500"
                        >
                          <FaTrash size={11} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div {...fadeUp}>
              {normalList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 border border-[var(--color-border)] px-4 py-16 text-center text-[var(--color-muted)] sm:py-20">
                  <BiPackage className="text-4xl opacity-30" />
                  <p className="text-sm">All products are already marked as popular.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
                  {normalList?.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 bg-[var(--color-card)] p-3 sm:gap-4 sm:p-4">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                        className="h-12 w-12 shrink-0 object-cover sm:h-14 sm:w-14"
                        alt={item.name}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[13px] font-semibold sm:text-[14px]">{item.name}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--color-muted)] sm:text-[12px]">{item.Category}</p>
                      </div>
                      <button
                        onClick={() => handleAddPopular(item._id)}
                        className="flex shrink-0 items-center gap-1.5 border border-[var(--color-text)] px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] sm:px-3"
                      >
                        <HiOutlineFire size={13} />
                        <span className="hidden sm:inline">Popular</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </div>
  );
}