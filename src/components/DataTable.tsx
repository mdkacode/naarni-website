// Generic Data Table Component using Ant Design
import React from "react";
import { Table } from "antd";
import type { TableProps, ColumnType } from "antd/es/table";
import { useTheme } from "../contexts/ThemeContext";

export interface DataTableColumn<T = any> extends ColumnType<T> {
  key: string;
  title: string;
  dataIndex?: string | string[];
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: T) => boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: TableProps<T>["pagination"] | false;
  scroll?: TableProps<T>["scroll"];
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index?: number) => React.HTMLAttributes<HTMLElement>;
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  className?: string;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination = false,
  scroll = { x: "max-content" },
  rowKey = "id",
  onRow,
  size = "middle",
  bordered = false,
  className = "",
}: DataTableProps<T>) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${className} ${isDark ? "dark" : ""}`}>
      <Table<T>
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        scroll={scroll}
        rowKey={rowKey}
        onRow={onRow}
        size={size}
        bordered={bordered}
        className="w-full"
      />
    </div>
  );
};

