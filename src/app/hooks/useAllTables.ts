import { useState } from "react";
import { Table } from "core/tables/entities/Table";
import {
  getAllTablesByKitchenId,
  getTableById,
  updateTableStatus,
} from "core/tables/repository/TableRepo";

export interface UseAllTables {
  getTables: (kitchenId: string) => void;
  tables: Table[];
  loading: boolean;
  updateStatus: (id: string, status: string) => Promise<void>;
  findOne: (id: string) => Promise<Table | undefined>;
}

export const useAllTables = (): UseAllTables => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getTables = (kitchenId: string) => {
    if (loading) return;
    setLoading(true);

    getAllTablesByKitchenId(kitchenId)
      .then((response) => {
        setTables(response);
      })
      .catch(() => {
        setTables([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateTableStatus(id, status);
      setTables((prev) =>
        prev.map((table) => (table.id === id ? { ...table, status } : table))
      );
    } catch (error) {
      console.error("Error updating table status:", error);
      throw error;
    }
  };

  const findOne = async (id: string): Promise<Table | undefined> => {
    try {
      return await getTableById(id);
    } catch (error) {
      console.error("Error finding table:", error);
      return undefined;
    }
  };

  return {
    getTables,
    tables,
    loading,
    updateStatus,
    findOne,
  };
};
