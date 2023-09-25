import Link from 'next/link';

export default function Index() {
  return (
    <div className="mt-5">
      <Link href="/forms/clientInfo" className="font-size-lg m-5 text-lg text-slate-500">
        Client Info
      </Link>
      <Link href="/forms/farmInfo" className="font-size-lg m-5 text-lg text-slate-500">
        Farm Info
      </Link>
      <Link href="/forms/dwellingInfo" className="font-size-lg m-5 text-lg text-slate-500">
        Dwelling Info
      </Link>
      <Link href="/forms/contents" className="font-size-lg m-5 text-lg text-slate-500">
        Household Contents
      </Link>
    </div>
  );
}
