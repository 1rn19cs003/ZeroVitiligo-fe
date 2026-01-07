'use client';

import { Download, Loader2 } from 'lucide-react';
import { useDatabaseExport } from '../../hooks/useDatabaseExport';
import styles from './styles.module.css';

export default function DatabaseExport() {
    const { isExporting, progress, startExport } = useDatabaseExport();

    return (
        <div className={styles.container}>
            <button
                onClick={startExport}
                disabled={isExporting}
                className={`${styles.exportButton} ${isExporting ? styles.active : ''}`}
                title="Export full database (Streams all tables)"
            >
                {isExporting ? (
                    <Loader2 className={styles.spinner} size={20} />
                ) : (
                    <Download size={20} />
                )}

                <span className={styles.label}>
                    {isExporting ? progress || 'Exporting...' : 'Export Full Database'}
                </span>
            </button>

            {isExporting && (
                <div className={styles.progressBar}>
                    <div className={styles.progressIndeterminate}></div>
                </div>
            )}
        </div>
    );
}
