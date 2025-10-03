// src/app/components/MenuView/index.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Stack, useMediaQuery, Dialog } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMenu } from "app/components/PageHeader/hooks/useMenu";
import { getLocalStorageJSON, LocalStorageItem } from "utils/localStorage";
import { SelectItem } from "core/stores/menu/entities/Menu";
import MenuStickyBar from "./MenuStickyBar";
import CategorySections from "./CategorySections";
import { ProductModal } from "./ProductModal";
import { ShoppingCartPanel } from "./ShoppingCartPanel";
import { MobileCartButton } from "./MobileCart/MobileCartButton";
import { MobileCartDrawer } from "./MobileCart/MobileCartDrawer";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { useCart } from "./hooks/useCart";
import { useCartCalculations } from "./hooks/useCartCalculations";
import { ModifiersState } from "./types";
import { StoreSelector } from "./StoreSelector";
import { orderManager } from "./utils/orderManager";
import { OrderStatus } from "./types/order";

const TOPBAR_QUERY = "#topBar, [data-topbar], header.MuiAppBar-root";
const HEADER_HEIGHT_FALLBACK = 64;

interface MenuViewProps {
  onBack: () => void;
}

const MenuView: React.FC<MenuViewProps> = ({ onBack }) => {
  const { fetchMenu, menuData, loading, error } = useMenu();
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectItem, setSelectItem] = useState<SelectItem | undefined>();
  const [topOffset, setTopOffset] = useState<number>(HEADER_HEIGHT_FALLBACK);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuBarLeft, setMenuBarLeft] = useState(0);
  const [menuBarWidth, setMenuBarWidth] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  const { cart, addToCart, clearCart, incrementItem, decrementItem } =
    useCart();
  const { cartTotals, cartItemsForPanel } = useCartCalculations(cart);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const headerEl = document.querySelector(TOPBAR_QUERY) as HTMLElement | null;
    const updateTopOffset = () => {
      const headerH = headerEl?.offsetHeight ?? HEADER_HEIGHT_FALLBACK;
      setTopOffset(headerH);
    };
    updateTopOffset();
    window.addEventListener("resize", updateTopOffset);
    return () => window.removeEventListener("resize", updateTopOffset);
  }, []);

  useEffect(() => {
    const store = getLocalStorageJSON("selectedStore" as LocalStorageItem);
    setSelectedStore(store);
    if (store && typeof store === "object" && "id" in store) {
      fetchMenu((store as any).id);
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (!leftColumnRef.current) return;
      const rect = leftColumnRef.current.getBoundingClientRect();
      setMenuBarLeft(rect.left);
      setMenuBarWidth(rect.width);
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const container = document.getElementById("menu-scroll");
    if (!container)
      return () => window.removeEventListener("resize", updateDimensions);

    const handleScroll = () => {
      setHasScrolled(container.scrollTop > 0);
      const keys = Object.keys(menuData?.menu?.children || {});
      if (!keys.length) return;
      const sorted = keys.sort((a, b) => {
        const A: any = (menuData?.menu?.children as any)?.[a];
        const B: any = (menuData?.menu?.children as any)?.[b];
        return (A?.priority || 0) - (B?.priority || 0);
      });
      for (let i = 0; i < sorted.length; i++) {
        const element = document.getElementById(sorted[i]);
        if (!element) continue;
        const bounding = element.getBoundingClientRect();
        const containerTop = container.getBoundingClientRect().top;
        const relativeTop = bounding.top - containerTop;
        if (relativeTop >= 0 && relativeTop <= 300) {
          setActiveMenuIndex(i);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [menuData]);

  const menuCategories = useMemo(() => {
    if (!menuData?.menu?.children) return [];
    return Object.entries(menuData.menu.children)
      .map(([id, value]) => ({ id, ...(value as any) }))
      .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
  }, [menuData]);

  const handleMenuClick = (categoryId: string) => {
    const container = document.getElementById("menu-scroll");
    const section = document.getElementById(categoryId);
    if (!section || !container) return;
    const offsetTop = section.offsetTop - topOffset - 60;
    container.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);

  const getValidImage = (image: any) => image?.url || "";

  const hasModifiers = (product: any): boolean => {
    if (!product?.children) return false;
    if (!Object.keys(product.children).length) return false;
    return Object.values(product.children).some(
      (child: any) => child?.children && Object.keys(child.children).length > 0
    );
  };

  const buildSelectItem = (product: any, sku: string) => ({
    idItem: sku,
    name: product?.name,
    title: product?.name,
    description: product?.description ?? "",
    price: product?.price ?? 0,
    image: getValidImage(product?.image),
    modifiers: product,
    available: product?.available !== false,
    comment: product?.comment ?? "",
    storeId: selectedStore?.id,
  });

  const handleStoreChange = (storeId: string) => {
    fetchMenu(storeId);
  };

  const addToCartDirect = (product: any, sku: string) => {
    const base = {
      name: product?.name,
      price: product?.price ?? 0,
      image: getValidImage(product?.image),
    };
    addToCart(base, sku, undefined, "", 1);
  };

  const handleOpenModal = (product: any, sku: string) =>
    setSelectItem(buildSelectItem(product, sku));

  const handleAddClick = (product: any, sku: string) => {
    if (hasModifiers(product)) handleOpenModal(product, sku);
    else addToCartDirect(product, sku);
  };

  const handleCloseModal = () => setSelectItem(undefined);

  const handleContinueOrder = () => {
    const table = getLocalStorageJSON(
      "selectedTable" as LocalStorageItem
    ) as any;
    const store = getLocalStorageJSON(
      "selectedStore" as LocalStorageItem
    ) as any;

    if (!table || !store) {
      console.error("No hay mesa o tienda seleccionada");
      return;
    }

    const orderItems = Object.values(cart).map((item) => {
      const unitPrice =
        item.price +
        (item.modifiers
          ? Object.values(item.modifiers).reduce((sum, group) => {
              return (
                sum +
                Object.values(group).reduce(
                  (gSum, opt) => gSum + (opt.price ?? 0) * (opt.quantity ?? 0),
                  0
                )
              );
            }, 0)
          : 0);

      return {
        key: item.key,
        sku: item.sku,
        title: item.title,
        quantity: item.quantity,
        unitPrice: unitPrice,
        lineTotal: unitPrice * item.quantity,
        image: item.image,
      };
    });

    const order = orderManager.createOrder({
      tableId: table.id,
      tableName: table.name,
      storeId: store.id,
      storeName: store.brand?.name || store.name,
      items: orderItems,
      total: cartTotals.total,
      status: OrderStatus.PENDING,
    });

    console.log("Orden creada:", order);
    clearCart();
    setDrawerOpen(false);

    onBack();
  };

  if (loading) {
    return <LoadingState onBack={onBack} />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onBack={onBack}
        onRetry={() => selectedStore && fetchMenu(selectedStore.id)}
      />
    );
  }

  if (!menuData?.menu?.children) {
    return <EmptyState onBack={onBack} onStoreChange={handleStoreChange} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FA" }}>
      <Stack sx={{ padding: { xs: "0 12px", md: "0 24px" } }}>
        <Box>
          <MenuStickyBar
            top={topOffset}
            left={menuBarLeft}
            width={menuBarWidth}
            items={menuCategories.map((c: any) => ({ id: c.id, name: c.name }))}
            activeIndex={activeMenuIndex}
            onItemClick={(item) => handleMenuClick(item.id)}
            hasScrolled={hasScrolled}
          />

          <Box sx={{ display: "flex", gap: 3 }}>
            <Box
              ref={leftColumnRef}
              sx={{
                flex: { xs: "1", md: "0 0 66.666%" },
                pt: 3,
              }}
            >
              <CategorySections
                categories={menuCategories}
                formatPrice={formatPrice}
                getImage={getValidImage}
                onOpenModal={handleOpenModal}
                onAdd={handleAddClick}
              />
            </Box>

            {!isMobile && (
              <Box sx={{ flex: "0 0 33.333%" }}>
                <StoreSelector onStoreChange={handleStoreChange} />
                <ShoppingCartPanel
                  items={cartItemsForPanel}
                  totalQuantity={cartTotals.totalQty}
                  total={cartTotals.total}
                  formatPrice={formatPrice}
                  onClearCart={clearCart}
                  onIncrementItem={incrementItem}
                  onDecrementItem={decrementItem}
                  onContinue={handleContinueOrder}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Stack>

      {isMobile && (
        <>
          <MobileCartButton
            totalQty={cartTotals.totalQty}
            total={cartTotals.total}
            formatPrice={formatPrice}
            onOpen={() => setDrawerOpen(true)}
          />
          <MobileCartDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            items={cartItemsForPanel}
            totalQty={cartTotals.totalQty}
            total={cartTotals.total}
            formatPrice={formatPrice}
            onClearCart={clearCart}
            onIncrementItem={incrementItem}
            onDecrementItem={decrementItem}
            onContinue={handleContinueOrder}
          />
        </>
      )}

      <Dialog
        open={!!selectItem}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            height: { xs: "92dvh", md: "84dvh" },
            maxHeight: "none",
            "&.MuiDialog-paperScrollPaper": {
              maxHeight: "none",
              overflowY: "hidden",
            },
          },
        }}
      >
        {selectItem && (
          <ProductModal
            selectItem={selectItem as any}
            onClose={handleCloseModal}
            onConfirm={({ sku, quantity, modifiers, comment }) => {
              addToCart(
                {
                  name: selectItem.name,
                  price: selectItem.price,
                  image: selectItem.image,
                },
                sku,
                modifiers as ModifiersState,
                comment,
                quantity ?? 1
              );
              handleCloseModal();
            }}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default MenuView;
