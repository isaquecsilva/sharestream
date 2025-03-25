import { IoIosArrowRoundBack } from 'react-icons/io'
import Link from 'next/link'

export default function UploadButton() {
	return <Link href="/upload" className="bg-blue-400 p-4 rounded h-10 flex items-center font-semibold text-white active:scale-98">+ Upload</Link>
}