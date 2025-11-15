"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useDoctorStore from "@/store/useDoctorStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { usePatients } from '../../hooks/usePatients'

export default function DoctorTable() {
  const { columns, filters, setData, setColumns } = useDoctorStore();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data = [], isLoading } = usePatients();

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

    return matchesFilters && matchesSearch;
  }) || [];

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

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
        <p>Manage patient data efficiently with real-time filters and a responsive layout.</p>
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
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {selectedColumns.map(col => (
                      <th key={col}>{col}</th>
                    ))}
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
                        {selectedColumns.map(col => (
                          <td key={col}>{row[col]}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={selectedColumns.length} className={styles.noData}>No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls at Bottom */}
            <div className={styles.paginationContainer}>
              <div className={styles.recordsPerPage}>
                <label htmlFor="recordsPerPage">Records per page: </label>
                <select id="recordsPerPage" value={recordsPerPage} onChange={handleRecordsPerPageChange}>
                  {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className={styles.paginationButtons}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
