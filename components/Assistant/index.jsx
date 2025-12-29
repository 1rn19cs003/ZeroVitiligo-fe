"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/Error';
import { useDoctorStore, useUserStore } from "@/store/useStatesStore";
import { useDoctors, useDeleteDoctor } from "@/hooks/useDoctors";
import { formatDate } from "../Miscellaneous";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants";
import ConfirmDialog from '../ConfirmDialog';

export default function AssistantTable() {
    const router = useRouter();
    const { columns, filters, setData, setColumns } = useDoctorStore();//useAssistantStore
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState('desc');
    const { data: userInfo } = useUserStore();

    const { data = [], isLoading, isError, error } = useDoctors();
    const { mutate: deleteDoctor } = useDeleteDoctor();
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, doctorId: null, doctorName: '' });

    const STATUS_TABS = [
        { value: ROLES.ADMIN, label: "Admin", visible: userInfo.role === ROLES.ADMIN },
        { value: ROLES.ASSISTANT, label: "Assistant", visible: true },
    ];

    const [activeTab, setActiveTab] = useState("ALL");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    useEffect(() => {
        if (!useIsAuthenticated()()) {
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        if (data.length > 0) {
            setData(data);
            const keys = Object.keys(data[0]).filter(key => key !== 'id');
            setColumns(keys);
            setSelectedColumns(keys);
        }
    }, [data, setData, setColumns]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // Matches status tab filter
            const matchesStatus = activeTab === "ALL" || row.role === activeTab;

            // Matches filters
            const matchesFilters = Object.entries(filters).every(([key, val]) => {
                if (!selectedColumns.includes(key)) return true;
                return (
                    val === "" ||
                    String(row[key]).toLowerCase().includes(val.toLowerCase())
                );
            });

            // Matches search query across selected columns
            const matchesSearch =
                searchQuery === "" ||
                selectedColumns.some((col) =>
                    String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
                );

            return matchesStatus && matchesFilters && matchesSearch;
        });
    }, [data, filters, searchQuery, selectedColumns, activeTab]);

    const sortedData = useMemo(() => {
        if (!sortOrder) return filteredData;
        return [...filteredData].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    }, [filteredData, sortOrder]);

    const totalRecords = sortedData.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleDeleteAssistant = (doctorId, doctorName) => {
        setDeleteConfirm({ isOpen: true, doctorId, doctorName });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.doctorId) {
            deleteDoctor(deleteConfirm.doctorId);
            setDeleteConfirm({ isOpen: false, doctorId: null, doctorName: '' });
        }
    };

    const handleRowClick = (assistant) => {
        router.push(`/profile?id=${assistant.id}&mode=update`);
    };

    const handleCreateAssistant = () => {
        router.push('/add-assistant')
    }

    return (
        <div className={styles.container}>
            <section className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div>
                        <h1>Assistant Management</h1>
                        <p>Manage assistant data and permissions efficiently.</p>
                    </div>
                    <button
                        onClick={handleCreateAssistant}
                        className={styles.newAssistantButton}
                        type="button"
                    >
                        + New Assistant
                    </button>
                </div>
            </section>

            <section className={styles.filterSection}>
                <div className={styles.filterRow}>
                    <div className={styles.searchContainer}>
                        <label htmlFor="search" className={styles.searchLabel}>
                            Search
                        </label>
                        <div className={styles.searchInputWrapper}>
                            <Search className={styles.searchIcon} />
                            <input
                                id="search"
                                type="text"
                                placeholder="Search across all columns..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.columnFilterContainer}>
                        <MultiSelectDropdown
                            options={columns}
                            selected={selectedColumns}
                            onChange={setSelectedColumns}
                            label="Select Columns to Display"
                        />
                    </div>
                </div>
            </section>


            <section className={styles.tableSection}>
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                        <p className={styles.loaderText}>Loading assistant data...</p>
                    </div>
                ) : isError ? (
                    <ErrorMessage message={error?.message || "Failed to load assistant data."} icon={true} />
                ) : (
                    <>
                        <section className={styles.tabsContainer}>
                            <button
                                className={`${styles.tab} ${activeTab === "ALL" ? styles.activeTab : ""}`}
                                onClick={() => {
                                    setActiveTab("ALL");
                                    setCurrentPage(1);
                                    setSortOrder('desc');
                                }}
                            >
                                All Assistants
                            </button>
                            {STATUS_TABS.map(({ value, label, visible }) => {
                                return (
                                    visible && <button
                                        key={value}
                                        className={`${styles.tab} ${activeTab === value ? styles.activeTab : ""}`}
                                        onClick={() => {
                                            setActiveTab(value);
                                            setCurrentPage(1);
                                            setSortOrder('desc');
                                        }}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </section>


                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        {selectedColumns.map((col) => {
                                            if (col === "createdAt") {
                                                return (
                                                    <th
                                                        key={col}
                                                        onClick={toggleSort}
                                                        style={{ cursor: "pointer", userSelect: "none" }}
                                                        title="Sort by Created At"
                                                    >
                                                        {col}{" "}
                                                        {sortOrder === "asc"
                                                            ? "↑"
                                                            : sortOrder === "desc"
                                                                ? "↓"
                                                                : "↓↑"}
                                                    </th>
                                                );
                                            }
                                            return <th key={col}>{col}</th>;
                                        })}
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentRecords.length > 0 ? (
                                        currentRecords.map((row, index) => (
                                            <tr
                                                key={index}
                                                onClick={() => handleRowClick(row)}
                                                className={styles.clickableRow}
                                            >
                                                {selectedColumns.map((col) => (
                                                    <td key={col}>
                                                        {col === "createdAt"
                                                            ? formatDate(row[col])
                                                            : row[col]}
                                                    </td>
                                                ))}
                                                <td>
                                                    {row?.role !== ROLES.ADMIN && <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteAssistant(row.id, row.name || 'this assistant');
                                                        }}
                                                        className={styles.deleteButton}
                                                    >
                                                        Delete
                                                    </button>}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={selectedColumns.length} className={styles.noData}>
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalRecords > 0 && (
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
                    </>
                )}
            </section>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, doctorId: null, doctorName: '' })}
                onConfirm={confirmDelete}
                title="Delete Assistant"
                message={`Are you sure you want to delete ${deleteConfirm.doctorName}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
