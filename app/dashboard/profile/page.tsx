'use client';
import { redirect } from 'next/navigation';
import { CURRENT_USER_ID } from '../../lib/data';

export default function MyProfileRedirect() {
    redirect(`/dashboard/profile/${CURRENT_USER_ID}`);
}
