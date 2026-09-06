"use client";

import { money } from "@/lib/club/money";
import { useClub } from "@/lib/club/use-club";

export default function ProductsPage() {
  const { state } = useClub();
  if (!state) return <p className="p-6 text-zinc-400">Loading products…</p>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-kada-green">Catalog</p>
        <h1 className="mt-1 text-2xl font-semibold">Products & recipes</h1>
      </div>
      {state.categories.map((category) => (
        <section key={category.id}>
          <h2 className="mb-3 text-lg font-semibold">
            {category.emoji} {category.name}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/4 text-zinc-400">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">HH</th>
                  <th className="px-3 py-2">Cost</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Recipe</th>
                </tr>
              </thead>
              <tbody>
                {state.products.filter((product) => product.categoryId === category.id).map((product) => {
                  const recipe = state.recipes.find((item) => item.id === product.recipeId);
                  return (
                    <tr key={product.id} className="border-t border-white/6">
                      <td className="px-3 py-2">{product.name}</td>
                      <td className="px-3 py-2 text-zinc-400">{product.sku}</td>
                      <td className="px-3 py-2">{money(product.price)}</td>
                      <td className="px-3 py-2">{product.happyHourPrice ? money(product.happyHourPrice) : "—"}</td>
                      <td className="px-3 py-2">{money(product.cost)}</td>
                      <td className="px-3 py-2">{product.recipeId ? "recipe" : `${product.inventory} ${product.unit}`}</td>
                      <td className="px-3 py-2 text-zinc-400">
                        {recipe
                          ? recipe.items
                              .map((item) => {
                                const ingredient = state.ingredients.find((entry) => entry.id === item.ingredientId);
                                return `${ingredient?.name} ${item.qty}${ingredient?.unit}`;
                              })
                              .join(" · ")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
