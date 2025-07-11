import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ title, backLink, children }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href={backLink} className="p-2 rounded-md hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
}
