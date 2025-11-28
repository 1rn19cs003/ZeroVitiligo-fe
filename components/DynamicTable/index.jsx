"use client";
import { useMemo, useState } from "react";
import styles from "./styles.module.css";
import Pagination from "../Pagination";

/**
 * DynamicTable Component
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of data objects
 * @param {Array} props.columns - Array of column configurations
 *   Each column object can have:
 *   - key: string (required) - unique identifier for the column
 *   - label: string (required) - display name for the column header
 *   - render: function(row, value) - custom render function for the cell
 *   - sortable: boolean - whether the column is sortable
 *   - width: string - custom width (e.g., "150px", "20%")
 *   - align: string - text alignment ("left", "center", "right")
 *   - className: string - custom CSS class for the column
 * @param {Function} props.onRowClick - Callback when row is clicked
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.pagination - Enable pagination
 * @param {number} props.defaultPageSize - Default records per page
 * @param {Array} props.pageSizeOptions - Options for records per page
 * @param {string} props.emptyMessage - Message to show when no data
 * @param {string} props.className - Custom class for table container
 * @param {Object} props.rowClassName - Function or string for row class
 * @param {Array} props.actions - Array of action buttons to show in each row
 */
export default function DynamicTable({
    data = [],
    columns = [],
    onRowClick,
    loading = false,
    pagination = true,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    emptyMessage = "No records found.",
    className = "",
    rowClassName,
    actions = [],
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(defaultPageSize);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortColumn) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            // Handle null/undefined
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            // Handle dates
            const aDate = new Date(aVal);
            const bDate = new Date(bVal);
            if (!isNaN(aDate) && !isNaN(bDate)) {
                return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
            }

            // Handle numbers
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
            }

            // Handle strings
            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();
            if (sortOrder === "asc") {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }, [data, sortColumn, sortOrder]);

    // Pagination logic
    const totalRecords = sortedData.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = pagination
        ? sortedData.slice(indexOfFirstRecord, indexOfLastRecord)
        : sortedData;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const toggleSort = (columnKey) => {
        const column = columns.find((col) => col.key === columnKey);
        if (!column?.sortable) return;

        if (sortColumn === columnKey) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(columnKey);
            setSortOrder("asc");
        }
    };

    const getCellValue = (row, column) => {
        const value = row[column.key];

        // If custom render function is provided, use it
        if (column.render) {
            return column.render(row, value);
        }

        // Default rendering
        return value ?? "N/A";
    };

    const getRowClass = (row, index) => {
        let classes = styles.tableRow;

        if (onRowClick) {
            classes += ` ${styles.clickableRow}`;
        }

        if (typeof rowClassName === "function") {
            classes += ` ${rowClassName(row, index)}`;
        } else if (rowClassName) {
            classes += ` ${rowClassName}`;
        }

        return classes;
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p className={styles.loaderText}>Loading data...</p>
            </div>
        );
    }

    return (
        <div className={`${styles.tableContainer} ${className}`}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => toggleSort(column.key)}
                                    style={{
                                        width: column.width,
                                        textAlign: column.align || "left",
                                        cursor: column.sortable ? "pointer" : "default",
                                    }}
                                    className={`${column.className || ""} ${column.sortable ? styles.sortableHeader : ""
                                        }`}
                                    title={column.sortable ? `Sort by ${column.label}` : ""}
                                >
                                    {column.label}
                                    {column.sortable && sortColumn === column.key && (
                                        <span className={styles.sortIcon}>
                                            {sortOrder === "asc" ? " ↑" : " ↓"}
                                        </span>
                                    )}
                                    {column.sortable && sortColumn !== column.key && (
                                        <span className={styles.sortIconInactive}> ↓↑</span>
                                    )}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className={styles.actionsHeader}>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    onClick={() => onRowClick?.(row, index)}
                                    className={getRowClass(row, index)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            style={{
                                                textAlign: column.align || "left",
                                            }}
                                            className={column.className || ""}
                                        >
                                            {getCellValue(row, column)}
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td className={styles.actionsCell}>
                                            <div className={styles.actionsContainer}>
                                                {actions.map((action, actionIndex) => (
                                                    <button
                                                        key={actionIndex}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            action.onClick(row, index);
                                                        }}
                                                        className={`${styles.actionButton} ${action.className || ""
                                                            }`}
                                                        disabled={action.disabled?.(row)}
                                                        title={action.label}
                                                    >
                                                        {action.icon || action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                    className={styles.noData}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && totalRecords > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    recordsPerPage={recordsPerPage}
                    onPageChange={handlePageChange}
                    onRecordsPerPageChange={handleRecordsPerPageChange}
                    showPageNumbers={true}
                    showJumpToFirst={true}
                    showJumpToLast={true}
                    maxPageButtons={3}
                />
            )}
        </div>
    );
}
