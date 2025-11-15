"use client";

import React from "react";
import styles from "./styles.module.css";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords = 0,
  recordsPerPage,
  recordsPerPageOptions = [5, 10, 20, 50, 100],
  onPageChange,
  onRecordsPerPageChange,
  showPageNumbers = true,
  showJumpToFirst = true,
  showJumpToLast = true,
  maxPageButtons = 5,
  className = "",
}) {
  // Calculate record range for current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage + 1;
  const actualLastRecord = Math.min(indexOfLastRecord, totalRecords);

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfRange = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      end = maxPageButtons;
    } else if (currentPage + halfRange >= totalPages) {
      start = totalPages - maxPageButtons + 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = showPageNumbers ? getPageNumbers() : [];

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleRecordsChange = (e) => {
    const newValue = Number(e.target.value);
    if (onRecordsPerPageChange) {
      onRecordsPerPageChange(e);
    }
  };

  return (
    <div className={`${styles.paginationWrapper} ${className}`}>
      <div className={styles.leftSection}>
        <div className={styles.recordsInfo}>
          Showing <strong>{indexOfFirstRecord}</strong> to{" "}
          <strong>{actualLastRecord}</strong> of{" "}
          <strong>{totalRecords}</strong> records
        </div>
        
        <div className={styles.recordsPerPage}>
          <label htmlFor="recordsPerPage">Rows per page:</label>
          <select
            id="recordsPerPage"
            value={recordsPerPage}
            onChange={handleRecordsChange}
            className={styles.dropdown}
          >
            {recordsPerPageOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.rightSection}>
        <div className={styles.navigationButtons}>
          {showJumpToFirst && (
            <button
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
              className={styles.navButton}
              aria-label="First page"
              title="First page"
            >
              <ChevronsLeft size={18} />
            </button>
          )}

          {/* Previous */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.navButton}
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          {showPageNumbers && (
            <div className={styles.pageNumbers}>
              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => handlePageClick(1)}
                    className={styles.pageButton}
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`${styles.pageButton} ${
                    currentPage === page ? styles.activePage : ""
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() => handlePageClick(totalPages)}
                    className={styles.pageButton}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Simple Page Info (when page numbers are hidden) */}
          {!showPageNumbers && (
            <span className={styles.pageInfo}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
            </span>
          )}

          {/* Next */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={styles.navButton}
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>

          {/* Jump to Last */}
          {showJumpToLast && (
            <button
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={styles.navButton}
              aria-label="Last page"
              title="Last page"
            >
              <ChevronsRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}