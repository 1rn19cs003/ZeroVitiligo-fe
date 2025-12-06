// Example Test Component - You can use this to test the global loader
// Place this in any page to test the functionality

"use client";

import { useGlobalLoader } from '@/hooks/useGlobalLoader';
import toast from 'react-hot-toast';

export default function LoaderTestComponent() {
    const { showLoader, hideLoader, withLoader } = useGlobalLoader();

    // Manual control example
    const testManualLoader = async () => {
        showLoader('Testing manual loader...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideLoader();
        toast.success('Manual loader test complete!');
    };

    // Automatic wrapper example
    const testAutoLoader = withLoader(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Auto loader test complete!');
    }, 'Testing auto loader...');

    // Multiple concurrent operations
    const testConcurrent = async () => {
        showLoader('Operation 1...');
        setTimeout(() => hideLoader(), 2000);

        showLoader('Operation 2...');
        setTimeout(() => hideLoader(), 3000);

        toast.success('Started concurrent operations!');
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <h2>Global Loader Test</h2>

            <button
                onClick={testManualLoader}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                }}
            >
                Test Manual Loader (2s)
            </button>

            <button
                onClick={testAutoLoader}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                }}
            >
                Test Auto Loader (2s)
            </button>

            <button
                onClick={testConcurrent}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                }}
            >
                Test Concurrent Operations
            </button>

            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Click any button to test the global loader. Try clicking multiple times rapidly to see how it prevents duplicate actions.
            </p>
        </div>
    );
}
