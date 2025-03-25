import Link from 'next/link';

export default function Head({ theme, title, href }): React.ReactElement {
	return (
		<header data-theme={theme}>
			<div className="w-full bg-none h-auto flex items-center justify-around flex-col gap-5 sm:flex-row">
				<Link href={href} target="_self">
					<h1 className="font-bold text-4xl">{title}</h1>
				</Link>
				<Link href="/upload" className="bg-blue-400 p-4 rounded h-10 flex items-center font-semibold text-white active:scale-98">+ Upload</Link>
			</div>
		</header>
	)
}