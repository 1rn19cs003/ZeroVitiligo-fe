import { Suspense } from 'react'
import Profile from './profilePage'
import Loader from '../../components/Loader'

export default function ProfilePage() {
    return (
        <Suspense fallback={<div><Loader /></div>}>
            <Profile />
        </Suspense>
    )
}