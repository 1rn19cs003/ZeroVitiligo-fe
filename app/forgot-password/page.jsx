'use client'
import ChangePassword from '@/components/ChangePassword'
import styles from './styles.module.css'
import { useLanguage } from '@/hooks/useLanguage';

export default function ForgotPassword() {
    const { t } = useLanguage();
    return (
        <div>
            <div className={styles.container}>
                <ChangePassword title={t('login.forgotPassword')} userName={true} />
            </div>
        </div>
    )
}