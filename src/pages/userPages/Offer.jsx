import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";
import { getAllOffers } from "../../features/customuseSlice";
import { setView } from "../../features/usersSlice";
import Loading from "../../components/loading";
import UserView from "../../components/UserView";

export default function Offer() {
    const dispatch = useDispatch();
    const { allOffers, loadingAllOffers } = useSelector((s) => s.customuseSlice);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const { view } = useSelector((state) => state.usersSlice);

    useEffect(() => {
        dispatch(getAllOffers());
    }, [dispatch]);

    const categories = ["All", ...new Set((allOffers ?? []).map((p) => p.Category))];

    const fuse = new Fuse(allOffers ?? [], {
        keys: ["name", "description", "Category"],
        threshold: 0.35,
    });
    const searched = search ? fuse.search(search).map((r) => r.item) : allOffers ?? [];

    const filtered = category === "All" ? searched : searched.filter((p) => p.Category === category);

    const grouped = {};

    for (let i = 0; i < filtered.length; i++) {
        const product = filtered[i];
        const categoryName = product.Category;

        // لو الكاتيجوري دي أول مرة نشوفها، نعمل لها array فاضية
        if (grouped[categoryName] === undefined) {
            grouped[categoryName] = [];
        }

        // نضيف المنتج جوه الـ array بتاعة الكاتيجوري بتاعته
        grouped[categoryName].push(product);
    }
    if (view) {
        return <UserView />;
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
            <h1 className="font-serif text-[36px] italic text-[var(--color-text)] sm:text-[44px]">
                Offers
            </h1>
            <p className="mt-2 text-[14px] text-[var(--color-muted)]">
                Limited-time prices across the collection.
            </p>

            {/* Search */}
            <input
                type="text"
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-8 w-full max-w-sm border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-[14px] outline-none focus:border-[var(--color-accent)] md:w-80"
            />

            {/* Category filter */}
            <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`border px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${category === cat
                            ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                            : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loadingAllOffers && (
                <Loading />
            )}

            {/* Empty */}
            {!loadingAllOffers && filtered.length === 0 && (
                <div className="mt-16 text-center text-[14px] text-[var(--color-muted)]">
                    No offers match your search.
                </div>
            )}

            {/* Grouped by category */}
            {!loadingAllOffers &&
                Object.keys(grouped).map((cat) => (
                    <div key={cat} className="mt-12">
                        <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                            {cat}
                        </h2>

                        <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {grouped[cat].map((item, i) => {
                                const size = item.sizes?.[0];

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.35 }}
                                        onClick={() => dispatch(setView(item))}
                                        className="group cursor-pointer bg-[var(--color-card)]"
                                    >
                                        <div className="relative aspect-[4/5] w-full overflow-hidden">
                                            <img
                                                onClick={() => dispatch(setView(item))}
                                                src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <span className="absolute left-0 top-0 bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-bg)]">
                                                Offer
                                            </span>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="truncate text-[14px] font-semibold text-[var(--color-text)]">
                                                {item.name}
                                            </h3>

                                            {size && (
                                                <div className="mt-1.5 flex items-center gap-2 text-[13px]">
                                                    {size.priceOffer != null && (
                                                        <span className="text-[var(--color-muted)] line-through">
                                                            {size.price} L.E
                                                        </span>
                                                    )}
                                                    <span className="font-semibold text-[var(--color-accent)]">
                                                        {size.priceOffer ?? size.price} L.E
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}

            <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
        </div>
    );
}