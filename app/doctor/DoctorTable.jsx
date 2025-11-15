"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import useDoctorStore from "@/store/useDoctorStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { usePatients } from '../../hooks/usePatients';
import Pagination from '../../components/Pagination';
import { formatDate } from "@/components/Miscellaneous";

export default function DoctorTable() {
  const router = useRouter();
  const { columns, filters, setData, setColumns } = useDoctorStore();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  const { data = [], isLoading } = usePatients();

  const STATUS_TABS = [
    { value: "NEW_REGISTRATION", label: "New Registration" },
    { value: "BLOCKED", label: "Blocked" },
  ];

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };


  const [activeTab, setActiveTab] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (data.length > 0) {
      setData(data);
      setColumns(Object.keys(data[0]));
      setSelectedColumns(Object.keys(data[0]));
    }
  }, [data, setData, setColumns]);

  const filteredData = data?.filter((row) => {
    const matchesFilters = Object.entries(filters).every(([key, val]) => {
      if (!selectedColumns.includes(key)) return true;
      return val === "" || String(row[key]).toLowerCase().includes(val.toLowerCase());
    });

    const matchesSearch = searchQuery === "" || selectedColumns.some(col =>
      String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesStatus =
      activeTab === "ALL" || row.status === activeTab;

    return matchesFilters && matchesSearch && matchesStatus;
  }) || [];

  const sortedData = useMemo(() => {
    if (!sortOrder) return filteredData;
    return [...filteredData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
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

  const handleRowClick = (patient) => {
    router.push(`/doctor/patient/${patient.id}`);
  };

  return (
    <div className={styles.container}>
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

      <section className={styles.tableSection}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loaderText}>Loading patient data...</p>
          </div>
        ) : (
          <>
            {/* Status Tabs */}
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tab} ${activeTab === "ALL" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("ALL")}
              >
                All Patients
              </button>

              {STATUS_TABS.map((status) => (
                <button
                  key={status.value}
                  className={`${styles.tab} ${activeTab === status.value ? styles.activeTab : ""}`}
                  onClick={() => {
                    setActiveTab(status.value)
                    setCurrentPage(1);
                    setSortOrder('');
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {selectedColumns.map((col) => {
                      if (col === 'createdAt') {
                        return (
                          <th
                            key={col}
                            onClick={toggleSort}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            title="Sort by Created At"
                          >
                            {col} {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '↓↑'}
                          </th>
                        );
                      }
                      return <th key={col}>{col}</th>;
                    })}
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((row, index) => {
                      {/* console.log({row,index}) */ }
                      return (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(row)}
                          className={styles.clickableRow}
                        >
                          {selectedColumns.map(col => {
                            return (<td key={col}>
                              {col === 'createdAt'
                                ? formatDate(row[col])
                                : row[col]
                              }
                            </td>)
                          })}
                        </tr>
                      )
                    })
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

            {/* Pagination */}
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
    </div>
  );
}