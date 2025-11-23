import VisitingFormWrapper from './VisitingFormWrapper';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '../../../../../components/Loader';

// Enable dynamic params for server-side rendering
export const dynamicParams = true;

export default async function FirstVisitPage({ params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <Suspense fallback={<Loader />}>
      <VisitingFormWrapper id={id} />
    </Suspense>
  );
}
