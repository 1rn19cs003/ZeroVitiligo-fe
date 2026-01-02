"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { useDoctorStore, useUserStore } from "@/store/useStatesStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePatients, useStatus } from '../../hooks/usePatients';
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
  const [sortColumn, setSortColumn] = useState('appointmentDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data: userInfo } = useUserStore();
  const { data = [], isLoading } = usePatients();
  const { data: statusData = [] } = useStatus();
  const [showAssistants, setShowAssistants] = useState(false);

  const STATUS_TABS = useMemo(() => {
    if (!statusData || statusData.length === 0) {
      return [
        { value: "SCHEDULED", label: "Scheduled" },
        { value: "NEW_REGISTRATION", label: "New Registration" },
        { value: "UNDER_TREATMENT", label: "Under Treatment" },
        { value: "PAUSE", label: "Pause" },
        { value: "FOLLOW_UP", label: "Follow Up" },
      ];
    }

    const statusResp = statusData.map(status => ({
      value: status.value || status.name || status,
      label: status.label || status.displayName || status.name || status
    }));

    return [
      ...statusResp
    ];
  }, [statusData]);

  const STATUS_LABEL_MAP = useMemo(() => {
    return STATUS_TABS.reduce((acc, tab) => {
      acc[tab.value] = tab.label;
      return acc;
    }, {});
  }, [STATUS_TABS]);

  const toggleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortOrder('asc');
    }
  };


  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [activeTab, setActiveTab] = useState(APPOINTMENT_STATUS.SCHEDULED);

  useEffect(() => {
    if (activeTab === APPOINTMENT_STATUS.SCHEDULED) {
      setSortColumn('appointmentDate');
      setSortOrder('asc');
    } else {
      setSortColumn('createdAt');
      setSortOrder('desc');
    }
  }, [activeTab]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    if (!useIsAuthenticated()()) {
      router.push("/login");
    }
  }, [router]);

  const deriveColumns = (data, selectedStatuses) => {
    if (!data.length) return [];

    // Get all possible keys from all rows (not just first row)
    const allKeys = new Set();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });

    const excludeCols = activeTab === APPOINTMENT_STATUS.SCHEDULED
      ? ['createdAt', 'appointmentStatus']
      : ['appointmentStatus'];

    let baseColumns = Array.from(allKeys).filter(key => !excludeCols.includes(key));

    // If activeTab is NOT SCHEDULED, also exclude appointmentDate if it exists
    if (activeTab !== APPOINTMENT_STATUS.SCHEDULED) {
      baseColumns = baseColumns.filter(key => key !== 'appointmentDate');
    }

    return baseColumns;
  };

  useEffect(() => {
    if (data.length > 0) {
      setData(data);
      const cols = deriveColumns(data, selectedStatuses);
      setColumns(cols);
      setSelectedColumns(cols);
    }
  }, [data, setData, setColumns, showAssistants, selectedStatuses, activeTab]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Handle status filtering
      if (activeTab === APPOINTMENT_STATUS.SCHEDULED) {
        if (row.appointmentStatus !== activeTab) {
          return false
        };
      } else {
        if (selectedStatuses.length > 0) {
          if (!selectedStatuses.includes(row.status)) return false;
        }
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
  }, [data, filters, searchQuery, selectedColumns, selectedStatuses, activeTab]);

  const sortedData = useMemo(() => {
    if (!sortOrder || !sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);
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

  const handleRowClick = (patient) => {
    router.push(`/doctor/patient/${patient.id}`);
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
    router.push('/register');
  };

  return (
    <div className={styles.container}>
      {userInfo.role === ROLES.ADMIN && (
        <div className={styles.toggleSection}>
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
        </div>
      )}
      {showAssistants ? (
        <AssistantTable />
      ) : (
        <>
          <section className={styles.headerSection}>
            <div className={styles.headerContent}>
              <div>
                <h1>Doctor Dashboard</h1>
                <p>Manage patient data efficiently.</p>
              </div>
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

              {activeTab === APPOINTMENT_STATUS.PATIENTS && (
                <div className={styles.columnFilterContainer}>
                  <MultiSelectDropdown
                    options={STATUS_TABS.map(tab => tab.value)}
                    selected={selectedStatuses}
                    onChange={(newStatuses) => {
                      setSelectedStatuses(newStatuses);
                      setCurrentPage(1);
                    }}
                    label="Filter by Status"
                    labelMap={STATUS_LABEL_MAP}
                  />
                </div>
              )}
            </div>
          </section>

          <section className={styles.tableSection}>
            <section className={styles.tabsContainer}>
              {[
                { label: "All Patients", value: APPOINTMENT_STATUS.PATIENTS, sortOrder: "desc" },
                { label: "Scheduled", value: APPOINTMENT_STATUS.SCHEDULED, sortOrder: "asc" },
                { label: "Completed", value: APPOINTMENT_STATUS.COMPLETED, sortOrder: "desc" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  className={`${styles.tab} ${activeTab === tab.value ? styles.activeTab : ""}`}
                  onClick={() => {
                    setActiveTab(tab.value);
                    setCurrentPage(1);
                    setSortOrder(tab.sortOrder);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </section>

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
                            onClick={() => handleRowClick(row)}
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