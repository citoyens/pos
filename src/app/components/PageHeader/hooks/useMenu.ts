import { MenuResponse } from "core/stores/menu/entities/Menu";
import { getMenu } from "core/stores/menu/repository/menuRepo";
import { useState } from "react";

export interface UseMenu {
  fetchMenu: (storeId: string) => void;
  menuData: MenuResponse | null;
  loading: boolean;
  error: string | null;
}

export const useMenu = (): UseMenu => {
  const [menuData, setMenuData] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async (storeId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getMenu(storeId);
      setMenuData(response);
    } catch (err: any) {
      setError(err.message || "Error al cargar el menú");
      setMenuData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchMenu,
    menuData,
    loading,
    error,
  };
};
