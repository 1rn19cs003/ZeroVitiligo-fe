'use client';

import { useState } from 'react';
import { Download, Loader2, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { useDatabaseExport } from '../../hooks/useDatabaseExport';
import styles from './styles.module.css';

export default function DatabaseExport() {
    const { isExporting, progress, startExport } = useDatabaseExport();
    const [format, setFormat] = useState('json');

    const handleExport = () => {
        startExport(format);
    };

    const formatOptions = [
        { id: 'json', label: 'JSON (Full Data)', icon: <FileJson size={16} /> },
        { id: 'xlsx', label: 'Excel (XLSX)', icon: <FileSpreadsheet size={16} /> },
        { id: 'csv', label: 'CSV (Zipped)', icon: <FileText size={16} /> },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.formatSelector}>
                <label className={styles.selectorLabel}>Format:</label>
                <div className={styles.optionsGrid}>
                    {formatOptions.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormat(opt.id)}
                            disabled={isExporting}
                            className={`${styles.optionBtn} ${format === opt.id ? styles.optionActive : ''}`}
                        >
                            {opt.icon}
                            <span>{opt.id.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleExport}
                disabled={isExporting}
                className={`${styles.exportButton} ${isExporting ? styles.active : ''}`}
                title={`Export as ${format.toUpperCase()}`}
            >
                {isExporting ? (
                    <Loader2 className={styles.spinner} size={20} />
                ) : (
                    <Download size={20} />
                )}

                <span className={styles.label}>
                    {isExporting ? progress || 'Exporting...' : `Export as ${format.toUpperCase()}`}
                </span>
            </button>

            {isExporting && (
                <div className={styles.progressBar}>
                    <div className={styles.progressIndeterminate}></div>
                </div>
            )}

            <p className={styles.helperText}>
                {format === 'xlsx' && "All tables will be in separate sheets."}
                {format === 'csv' && "Tables will be compressed into a single ZIP file."}
                {format === 'json' && "Full relational data in a single JSON structure."}
            </p>
        </div>
    );
}
