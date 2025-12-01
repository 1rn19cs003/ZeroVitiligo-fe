"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import { ChevronDown, X, Check } from "lucide-react";


export function MultiSelectDropdown({ options, selected, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const selectAll = () => {
    onChange(options);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <label className={styles.dropdownLabel}>{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.dropdownButton}
      >
        <span className={styles.dropdownButtonText}>
          {selected.length === 0
            ? "Select columns..."
            : `${selected.length} column${selected.length !== 1 ? "s" : ""} selected`}
        </span>
        <ChevronDown
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconOpen : ""}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>
            <button
              type="button"
              onClick={selectAll}
              className={`${styles.headerButton} ${styles.selectAllButton}`}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className={`${styles.headerButton} ${styles.clearAllButton}`}
            >
              Clear All
            </button>
          </div>
          
          <div className={styles.optionsList}>
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <label key={option} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(option)}
                    className={styles.checkbox}
                  />
                  <div
                    className={`${styles.checkboxCustom} ${
                      isSelected ? styles.checkboxCustomChecked : ""
                    }`}
                  >
                    {isSelected && <Check className={styles.checkIcon} />}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className={styles.selectedTags}>
          {selected.map((item) => (
            <span key={item} className={styles.tag}>
              {item}
              <button
                type="button"
                onClick={() => toggleOption(item)}
                className={styles.tagRemoveButton}
              >
                <X className={styles.removeIcon} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}