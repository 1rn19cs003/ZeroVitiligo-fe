'use client'
import ChangePassword from '@/components/ChangePassword'
import styles from './styles.module.css'

export default function ForgotPassword() {
    return (
        <div>
            <div className={styles.container}>
                <ChangePassword title={t('forgotPassword.title')} />
            </div>
        </div>
    )
}