"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { useDoctorStore, useUserStore } from "@/store/useDoctorStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeletePatient, usePatients } from '../../hooks/usePatients';
import Pagination from '../../components/Pagination';
import { formatDate } from "@/components/Miscellaneous";
import AssistantTable from './../../components/Assistant';
import { useIsAuthenticated } from "@/hooks/useAuth";
import { APPOINTMENT_STATUS, ROLES } from "@/lib/constants";
import ConfirmDialog from '../../components/ConfirmDialog';

export default function DoctorTable() {
  const router = useRouter();
  const { columns, filters, setData, setColumns } = useDoctorStore();

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const { data: userInfo } = useUserStore();
  const { data = [], isLoading } = usePatients();
  const { mutate: deletePatient } = useDeletePatient();
  const [showAssistants, setShowAssistants] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, patientId: null, patientName: '' });

  const STATUS_TABS = [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "NEW_REGISTRATION", label: "New Registration" },
    { value: "UNDER_TREATMENT", label: "Under Treatment" },
    { value: "PAUSE", label: "Pause" },
    { value: "FOLLOW_UP", label: "Follow Up" },
  ];

  const toggleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortOrder('asc');
    }
  };


  const [activeTab, setActiveTab] = useState("SCHEDULED");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    if (!useIsAuthenticated()()) {
      router.push("/login");
    }
  }, [router]);

  const deriveColumns = (data, activeTab) => {
    if (!data.length) return [];

    // Get all possible keys from all rows (not just first row)
    const allKeys = new Set();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });

    const excludeCols = activeTab === 'SCHEDULED'
      ? ['createdAt', 'appointmentStatus']
      : ['appointmentStatus'];

    let baseColumns = Array.from(allKeys).filter(key => !excludeCols.includes(key));

    // If not SCHEDULED tab, also exclude appointmentDate if it exists
    if (activeTab !== 'SCHEDULED') {
      baseColumns = baseColumns.filter(key => key !== 'appointmentDate');
    }

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

  const renderAppointmentDate = (appointmentDate) => {
    if (!appointmentDate) return 'N/A';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    const diffTime = apptDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let chipClass = styles.statusChip;
    let statusText = '';

    if (diffDays < 0) {
      chipClass += ` ${styles.statusChipOverdue}`;
      statusText = 'Overdue';
    } else if (diffDays <= 5) {
      chipClass += ` ${styles.statusChipUpcoming}`;
      statusText = 'Upcoming';
    } else {
      chipClass += ` ${styles.statusChipFuture}`;
      statusText = 'Scheduled';
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span>{formatDate(appointmentDate)}</span>
        <span className={chipClass}>{statusText}</span>
      </div>
    );
  };

  const handleCreatePatient = () => {
    router.push('/contact');
  };

  const handleDeletePatient = (patientId, patientName) => {
    setDeleteConfirm({ isOpen: true, patientId, patientName });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.patientId) {
      deletePatient(deleteConfirm.patientId);
      setDeleteConfirm({ isOpen: false, patientId: null, patientName: '' });
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
          <section>
            <div className={styles.newPatientButtonContainer}>
              <button
                onClick={handleCreatePatient}
                className={styles.newPatientButton}
                type="button"
              >
                + New Patient
              </button>
            </div>
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
                                {col === 'appointmentDate'
                                  ? renderAppointmentDate(row[col])
                                  : col === "createdAt"
                                    ? formatDate(row[col])
                                    : col.includes('.')
                                      ? getNestedValue(row, col)
                                      : row[col]}
                              </td>
                            ))}
                            {userInfo.role === ROLES.ADMIN && <td>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePatient(row.id, row.name || 'this patient');
                                }}
                                className={styles.deleteButton}
                              >
                                Delete
                              </button>
                            </td>}
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

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, patientId: null, patientName: '' })}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${deleteConfirm.patientName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}