"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

type Product = {
  id: string;
  name: string;
  presentation: string | null;
  price: number;
  available: boolean;
  image_url: string | null;
  category_id: string;
};

export default function AdminPage() {
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // PRODUCTO
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState("");

  const [productName, setProductName] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productPresentation, setProductPresentation] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productAvailable, setProductAvailable] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(
    null
  );

  // CATEGORÍA
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // =========================================
  // CARGAR CATEGORÍAS
  // =========================================

  async function loadCategories() {
    setLoadingCategories(true);

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name, slug, image_url, active, sort_order"
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("ERROR CATEGORÍAS:", error);
      setError("No se pudieron cargar las categorías.");
      setLoadingCategories(false);
      return;
    }

    setCategories(data ?? []);
    setLoadingCategories(false);
  }

  // =========================================
  // CARGAR PRODUCTOS
  // =========================================

  async function loadProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, presentation, price, available, image_url, category_id"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ERROR PRODUCTOS:", error);
      setError("No se pudieron cargar los productos.");
      setLoadingProducts(false);
      return;
    }

    setProducts(data ?? []);
    setLoadingProducts(false);
  }

  // =========================================
  // IMAGEN PRODUCTO
  // =========================================

  function handleProductImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProductImage(file);
    setProductImagePreview(URL.createObjectURL(file));
  }

  // =========================================
  // IMAGEN CATEGORÍA
  // =========================================

  function handleCategoryImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCategoryImage(file);
    setCategoryImagePreview(URL.createObjectURL(file));
  }

  // =========================================
  // LIMPIAR PRODUCTO
  // =========================================

  function resetProductForm() {
    setProductImage(null);
    setProductImagePreview("");
    setProductName("");
    setProductCategoryId("");
    setProductPresentation("");
    setProductPrice("");
    setProductAvailable(true);
    setEditingProductId(null);
  }

  // =========================================
  // LIMPIAR CATEGORÍA
  // =========================================

  function resetCategoryForm() {
    setCategoryName("");
    setCategoryImage(null);
    setCategoryImagePreview("");
    setEditingCategoryId(null);
  }

  // =========================================
  // EDITAR PRODUCTO
  // =========================================

  function startEditingProduct(product: Product) {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductCategoryId(product.category_id);
    setProductPresentation(product.presentation ?? "");
    setProductPrice(String(product.price));
    setProductAvailable(product.available);
    setProductImage(null);
    setProductImagePreview(product.image_url ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================
  // EDITAR CATEGORÍA
  // =========================================

  function startEditingCategory(category: Category) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryImage(null);
    setCategoryImagePreview(category.image_url ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================
  // SUBIR IMAGEN
  // =========================================

  async function uploadImage(file: File, folder: string) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(
        `No se pudo subir la imagen: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // =========================================
  // GUARDAR PRODUCTO
  // =========================================

  async function handleProductSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!productName.trim()) {
        throw new Error("Escribe el nombre del producto.");
      }

      if (!productCategoryId) {
        throw new Error("Selecciona una categoría.");
      }

      if (!productPresentation.trim()) {
        throw new Error("Escribe la presentación.");
      }

      if (!productPrice || Number(productPrice) < 0) {
        throw new Error("Escribe un precio válido.");
      }

      let imageUrl: string | null = editingProductId
        ? productImagePreview || null
        : null;

      if (productImage) {
        imageUrl = await uploadImage(
          productImage,
          "products"
        );
      }

      if (editingProductId) {
        const { error } = await supabase
          .from("products")
          .update({
            category_id: productCategoryId,
            name: productName.trim(),
            presentation: productPresentation.trim(),
            price: Number(productPrice),
            available: productAvailable,
            image_url: imageUrl,
          })
          .eq("id", editingProductId);

        if (error) {
          throw new Error(
            `No se pudo actualizar el producto: ${error.message}`
          );
        }

        setMessage("Producto actualizado correctamente.");
      } else {
        const { error } = await supabase
          .from("products")
          .insert({
            category_id: productCategoryId,
            name: productName.trim(),
            presentation: productPresentation.trim(),
            price: Number(productPrice),
            available: productAvailable,
            image_url: imageUrl,
            featured: false,
            sort_order: 0,
          });

        if (error) {
          throw new Error(
            `No se pudo guardar el producto: ${error.message}`
          );
        }

        setMessage("Producto agregado correctamente.");
      }

      resetProductForm();
      await loadProducts();
    } catch (error) {
      console.error("ERROR PRODUCTO:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // GUARDAR CATEGORÍA
  // =========================================

  async function handleCategorySubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!categoryName.trim()) {
        throw new Error("Escribe el nombre de la categoría.");
      }

      let imageUrl: string | null = editingCategoryId
        ? categoryImagePreview || null
        : null;

      if (categoryImage) {
        imageUrl = await uploadImage(
          categoryImage,
          "categories"
        );
      }

      if (editingCategoryId) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: categoryName.trim(),
            image_url: imageUrl,
          })
          .eq("id", editingCategoryId);

        if (error) {
          throw new Error(
            `No se pudo actualizar la categoría: ${error.message}`
          );
        }

        setMessage("Categoría actualizada correctamente.");
      } else {
        const slug = categoryName
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const maxSortOrder =
          categories.length > 0
            ? Math.max(
                ...categories.map(
                  (category) => category.sort_order || 0
                )
              )
            : 0;

        const { error } = await supabase
          .from("categories")
          .insert({
            name: categoryName.trim(),
            slug,
            image_url: imageUrl,
            active: true,
            sort_order: maxSortOrder + 1,
          });

        if (error) {
          throw new Error(
            `No se pudo crear la categoría: ${error.message}`
          );
        }

        setMessage("Categoría creada correctamente.");
      }

      resetCategoryForm();
      await loadCategories();
    } catch (error) {
      console.error("ERROR CATEGORÍA:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // CAMBIAR DISPONIBILIDAD PRODUCTO
  // =========================================

  async function toggleAvailable(product: Product) {
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("products")
      .update({
        available: !product.available,
      })
      .eq("id", product.id);

    if (error) {
      setError("No se pudo cambiar el estado.");
      return;
    }

    setMessage(
      product.available
        ? "Producto marcado como agotado."
        : "Producto marcado como disponible."
    );

    await loadProducts();
  }

  // =========================================
  // ACTIVAR / OCULTAR CATEGORÍA
  // =========================================

  async function toggleCategory(category: Category) {
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("categories")
      .update({
        active: !category.active,
      })
      .eq("id", category.id);

    if (error) {
      setError("No se pudo cambiar el estado de la categoría.");
      return;
    }

    setMessage(
      category.active
        ? "Categoría ocultada."
        : "Categoría activada."
    );

    await loadCategories();
  }

  // =========================================
  // ELIMINAR PRODUCTO
  // =========================================

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setError("No se pudo eliminar el producto.");
      return;
    }

    setMessage("Producto eliminado correctamente.");

    if (editingProductId === product.id) {
      resetProductForm();
    }

    await loadProducts();
  }

  // =========================================
  // ELIMINAR CATEGORÍA
  // =========================================

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${category.name}"? Esto también eliminará los productos asociados.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      setError("No se pudo eliminar la categoría.");
      return;
    }

    setMessage("Categoría eliminada correctamente.");

    if (editingCategoryId === category.id) {
      resetCategoryForm();
    }

    await loadCategories();
    await loadProducts();
  }

  // =========================================
  // NOMBRE CATEGORÍA
  // =========================================

  function getCategoryName(categoryId: string) {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name ?? "Sin categoría";
  }

  // =========================================
  // LOGOUT
  // =========================================

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("No se pudo cerrar la sesión.");
      return;
    }

    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">

      <div className="mx-auto max-w-2xl">

        {/* ENCABEZADO */}

        <header className="mb-10">

          <div className="flex items-center justify-between gap-3">

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-widest text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span className="text-base">
                ←
              </span>

              MENU
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white"
            >
              CERRAR SESIÓN
            </button>

          </div>

          <div className="mt-8 flex items-center gap-4">

            <img
              src="/logo/logo-mao.png"
              alt="Mao Licores"
              className="w-14"
            />

            <div>

              <p className="text-xs tracking-[0.3em] text-white/40">
                MAO LICORES
              </p>

              <h1 className="mt-1 text-2xl font-semibold">
                Administración
              </h1>

            </div>

          </div>

        </header>

        {/* MENSAJES */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* CATEGORÍAS */}

        <section className="mb-12">

          <div className="mb-5">

            <h2 className="text-xl font-semibold">
              Categorías
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Crea y administra las categorías de tu carta.
            </p>

          </div>

          <form
            onSubmit={handleCategorySubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >

            <h3 className="text-base font-semibold">
              {editingCategoryId
                ? "Editar categoría"
                : "Nueva categoría"}
            </h3>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-white/70">
                Foto de categoría
              </label>

              <label className="flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.02]">

                {categoryImagePreview ? (
                  <img
                    src={categoryImagePreview}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">

                    <div className="text-3xl text-white/30">
                      +
                    </div>

                    <p className="mt-2 text-sm text-white/40">
                      Subir imagen
                    </p>

                  </div>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCategoryImageChange}
                  className="hidden"
                />

              </label>

            </div>

            <div className="mt-5">

              <label className="mb-2 block text-sm text-white/70">
                Nombre
              </label>

              <input
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.target.value)
                }
                placeholder="Ej. Tequilas"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">

              {editingCategoryId && (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-white/60"
                >
                  CANCELAR
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl bg-white px-4 py-3 text-xs font-semibold text-black ${
                  editingCategoryId ? "" : "col-span-2"
                }`}
              >
                {loading
                  ? "GUARDANDO..."
                  : editingCategoryId
                  ? "GUARDAR CAMBIOS"
                  : "CREAR CATEGORÍA"}
              </button>

            </div>

          </form>

          <div className="mt-5 space-y-3">

            {loadingCategories ? (

              <div className="rounded-2xl border border-white/10 p-6 text-center text-sm text-white/40">
                Cargando categorías...
              </div>

            ) : (

              categories.map((category) => (

                <article
                  key={category.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >

                  <div className="flex items-center gap-4">

                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">

                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-white/20">
                          SIN FOTO
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-medium">
                        {category.name}
                      </h3>

                      <span
                        className={`mt-2 inline-block rounded-md px-2.5 py-1 text-[9px] font-semibold tracking-wider ${
                          category.active
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {category.active
                          ? "ACTIVA"
                          : "OCULTA"}
                      </span>

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        startEditingCategory(category)
                      }
                      className="rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold text-white/60"
                    >
                      EDITAR
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleCategory(category)
                      }
                      className="rounded-xl bg-white/5 px-3 py-3 text-xs font-semibold text-white/60"
                    >
                      {category.active
                        ? "OCULTAR"
                        : "ACTIVAR"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteCategory(category)
                      }
                      className="rounded-xl bg-red-500/10 px-3 py-3 text-xs font-semibold text-red-400"
                    >
                      ELIMINAR
                    </button>

                  </div>

                </article>

              ))

            )}

          </div>

        </section>

        {/* PRODUCTOS */}

        <section>

          <div className="mb-5">

            <h2 className="text-xl font-semibold">
              Productos
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Administra todos los productos de tu carta.
            </p>

          </div>

          <form
            onSubmit={handleProductSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >

            <h3 className="text-base font-semibold">
              {editingProductId
                ? "Editar producto"
                : "Agregar producto"}
            </h3>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-white/70">
                Foto del producto
              </label>

              <label className="flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.02]">

                {productImagePreview ? (

                  <img
                    src={productImagePreview}
                    alt="Vista previa"
                    className="h-full w-full object-contain p-3"
                  />

                ) : (

                  <div className="text-center">

                    <div className="text-3xl text-white/30">
                      +
                    </div>

                    <p className="mt-2 text-sm text-white/40">
                      Subir imagen
                    </p>

                  </div>

                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleProductImageChange}
                  className="hidden"
                />

              </label>

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-white/70">
                Nombre
              </label>

              <input
                type="text"
                value={productName}
                onChange={(event) =>
                  setProductName(event.target.value)
                }
                placeholder="Ej. Johnnie Walker Black Label"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-white/70">
                Categoría
              </label>

              <select
                value={productCategoryId}
                onChange={(event) =>
                  setProductCategoryId(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >

                <option
                  value=""
                  disabled
                  className="bg-black"
                >
                  Selecciona una categoría
                </option>

                {categories
                  .filter((category) => category.active)
                  .map((category) => (

                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-black"
                    >
                      {category.name}
                    </option>

                  ))}

              </select>

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-white/70">
                Presentación
              </label>

              <input
                type="text"
                value={productPresentation}
                onChange={(event) =>
                  setProductPresentation(event.target.value)
                }
                placeholder="Ej. 750 ml"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-sm text-white/70">
                Precio
              </label>

              <input
                type="number"
                value={productPrice}
                onChange={(event) =>
                  setProductPrice(event.target.value)
                }
                placeholder="Ej. 189900"
                min="0"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />

              <p className="mt-2 text-xs text-white/30">
                Escribe solamente el número.
              </p>

            </div>

            <div className="mt-8">

              <label className="mb-3 block text-sm text-white/70">
                Estado
              </label>

              <button
                type="button"
                onClick={() =>
                  setProductAvailable(!productAvailable)
                }
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 ${
                  productAvailable
                    ? "border-green-500/20 bg-green-500/10"
                    : "border-red-500/20 bg-red-500/10"
                }`}
              >

                <div className="text-left">

                  <p className="font-medium">
                    {productAvailable
                      ? "Disponible"
                      : "Agotado"}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {productAvailable
                      ? "Visible como disponible."
                      : "Visible como agotado."}
                  </p>

                </div>

                <div
                  className={`flex h-7 w-12 items-center rounded-full p-1 ${
                    productAvailable
                      ? "justify-end bg-green-500"
                      : "justify-start bg-red-500"
                  }`}
                >
                  <div className="h-5 w-5 rounded-full bg-white" />
                </div>

              </button>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-2">

              {editingProductId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="rounded-xl border border-white/10 px-4 py-4 text-xs font-semibold text-white/60"
                >
                  CANCELAR
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl bg-white px-4 py-4 text-xs font-semibold text-black ${
                  editingProductId ? "" : "col-span-2"
                }`}
              >
                {loading
                  ? "GUARDANDO..."
                  : editingProductId
                  ? "GUARDAR CAMBIOS"
                  : "AGREGAR PRODUCTO"}
              </button>

            </div>

          </form>

          <div className="mt-6 space-y-3">

            {loadingProducts ? (

              <div className="rounded-2xl border border-white/10 p-6 text-center text-sm text-white/40">
                Cargando productos...
              </div>

            ) : products.length === 0 ? (

              <div className="rounded-2xl border border-white/10 p-6 text-center text-sm text-white/40">
                Todavía no hay productos.
              </div>

            ) : (

              products.map((product) => (

                <article
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >

                  <div className="flex gap-4">

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">

                      {product.image_url ? (

                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-contain p-2"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-[10px] text-white/20">
                          SIN FOTO
                        </div>

                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="font-medium">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-xs text-white/40">
                            {getCategoryName(product.category_id)}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {product.presentation ?? ""}
                          </p>

                        </div>

                        <p className="shrink-0 font-semibold">
                          {new Intl.NumberFormat(
                            "es-CO",
                            {
                              style: "currency",
                              currency: "COP",
                              maximumFractionDigits: 0,
                            }
                          ).format(product.price)}
                        </p>

                      </div>

                      <span
                        className={`mt-3 inline-block rounded-md px-2.5 py-1 text-[9px] font-semibold tracking-wider ${
                          product.available
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {product.available
                          ? "DISPONIBLE"
                          : "AGOTADO"}
                      </span>

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        startEditingProduct(product)
                      }
                      className="rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold text-white/60"
                    >
                      EDITAR
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleAvailable(product)
                      }
                      className={`rounded-xl px-3 py-3 text-xs font-semibold ${
                        product.available
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {product.available
                        ? "AGOTAR"
                        : "ACTIVAR"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProduct(product)
                      }
                      className="rounded-xl bg-red-500/10 px-3 py-3 text-xs font-semibold text-red-400"
                    >
                      ELIMINAR
                    </button>

                  </div>

                </article>

              ))

            )}

          </div>

        </section>

      </div>
    </main>
  );
}