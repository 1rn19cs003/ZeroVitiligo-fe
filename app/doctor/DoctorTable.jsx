"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { useDoctorStore, useUserStore } from "@/store/useDoctorStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePatients } from '../../hooks/usePatients';
import Pagination from '../../components/Pagination';
import { formatDate } from "@/components/Miscellaneous";
import AssistantTable from './../../components/Assistant';
import { useIsAuthenticated } from "@/hooks/useAuth";
import { APPOINTMENT_STATUS, ROLES } from "@/lib/constants";

export default function DoctorTable() {
  const router = useRouter();
  const { columns, filters, setData, setColumns } = useDoctorStore();

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const { data: userInfo } = useUserStore();
  const { data = [], isLoading } = usePatients();
  const [showAssistants, setShowAssistants] = useState(false);

  const STATUS_TABS = [
    { value: "NEW_REGISTRATION", label: "New Registration" },
    { value: "BLOCKED", label: "Blocked" },
    { value: "UNDER_TREATMENT", label: "Under Treatment" },
    { value: "PAUSE", label: "Pause" },
    { value: "FOLLOW_UP", label: "Follow Up" },
    { value: "SCHEDULED", label: "Scheduled" },
  ];

  const toggleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortOrder('asc');
    }
  };


  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    if (!useIsAuthenticated()()) {
      router.push("/login");
    }
  }, [router]);

  const deriveColumns = (data, activeTab) => {
    if (!data.length) return [];

    const excludeCols = activeTab === 'SCHEDULED'
      ? []
      : ['appointmentDate', 'appointmentStatus'];

    const baseColumns = Object.keys(data[0]).filter(key => !excludeCols.includes(key));

    return baseColumns;
  };

  useEffect(() => {
    if (data.length > 0) {
      setData(data);
      const cols = deriveColumns(data, activeTab);
      setColumns(cols);
      setSelectedColumns(cols);
    }
  }, [data, setData, setColumns, showAssistants, activeTab]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (activeTab === "SCHEDULED") {
        if (row.appointmentStatus !== "SCHEDULED") return false;
      } else if (activeTab !== "ALL" && row.status !== activeTab) {
        return false;
      }

      const matchesFilters = Object.entries(filters).every(([key, val]) => {
        if (!selectedColumns.includes(key)) return true;
        const fieldVal = key.includes('.') ? getNestedValue(row, key) : row[key];
        return val === "" || String(fieldVal ?? '').toLowerCase().includes(val.toLowerCase());
      });

      const matchesSearch = searchQuery === "" || selectedColumns.some(col => {
        const fieldVal = col.includes('.') ? getNestedValue(row, col) : row[col];
        return String(fieldVal ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      });

      return matchesFilters && matchesSearch;
    });
  }, [data, filters, searchQuery, selectedColumns, activeTab]);

  const sortedData = useMemo(() => {
    if (!sortOrder || !sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const dateA = new Date(a[sortColumn]).getTime();
      const dateB = new Date(b[sortColumn]).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredData, sortOrder, sortColumn]);


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

  const handleRowClick = (patient, activeTab) => {
    router.push(`/doctor/patient/${patient.id}`);
    if (activeTab === APPOINTMENT_STATUS.SCHEDULED) {
      router.push(`/doctor/patient/${patient.id}/visiting` + `?mode=history`);
    }
  };

  return (
    <div className={styles.container}>
      <section>
        {userInfo.role === ROLES.ADMIN && (
          <div className={styles.toggleContainer}>
            <button
              onClick={() => setShowAssistants(false)}
              disabled={!showAssistants}
              className={styles.toggleButton}
            >
              Doctor View
            </button>
            <button
              onClick={() => setShowAssistants(true)}
              disabled={showAssistants}
              className={styles.toggleButton}
            >
              Assistant View
            </button>
          </div>
        )}
      </section>
      {showAssistants ? (
        <AssistantTable />
      ) : (
        <>
          <section className={styles.headerSection}>
            <h1>Doctor Dashboard</h1>
            <p>Manage patient data efficiently.</p>
          </section>

          <section className={styles.filterSection}>
            <div className={styles.filterRow}>
              <div className={styles.searchContainer}>
                <label htmlFor="search" className={styles.searchLabel}>Search</label>
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

          <section className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === "ALL" ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveTab("ALL");
                setCurrentPage(1);
                setSortOrder('desc');
              }}
            >
              All Patients
            </button>

            {STATUS_TABS.map(({ value, label }) => (
              <button
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
            ))}
          </section>

          <section className={styles.tableSection}>
            {isLoading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p className={styles.loaderText}>Loading patient data...</p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {selectedColumns.map((col, index) => (
                          ["createdAt", "appointmentDate"].includes(col) ? (
                            <th
                              key={`${col}+${index}`}
                              onClick={() => toggleSort(col)}
                              style={{ cursor: "pointer", userSelect: "none" }}
                              title={`Sort by ${col}`}
                            >
                              {col} {sortColumn === col ? (sortOrder === "asc" ? "↑" : "↓") : '↓↑'}
                            </th>
                          ) : (
                            <th key={`${col}+${index}`}>{col}</th>
                          )
                        ))}
                      </tr>

                    </thead>
                    <tbody>
                      {currentRecords.length > 0 ? (
                        currentRecords.map((row, index) => (
                          <tr
                            key={index}
                            onClick={() => handleRowClick(row, activeTab)}
                            className={styles.clickableRow}
                          >
                            {selectedColumns.map(col => (
                              <td key={col}>
                                {(col === "createdAt" || col === 'appointmentDate')
                                  ? formatDate(row[col])
                                  : col.includes('.')
                                    ? getNestedValue(row, col)
                                    : row[col]}
                              </td>
                            ))}
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
        </>
      )}
    </div>
  );
}