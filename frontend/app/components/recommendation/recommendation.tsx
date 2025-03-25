import type { VideoCardProps } from '@/app/components/videocard/videocard.tsx'
import Image from 'next/image'
import { formatTimestamp } from '@/app/lib/utils'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VideoRecommendation({ props }: { props: VideoCardProps }) {
	const [theme, setTheme] = useState<string|null>('');

	useEffect(() => {
		setTheme(localStorage.getItem('theme'));
	}, [])

	return (
		<Link target="_self" href={`/watch/${props.hash}`}>
			<div className="flex flex-row items-center justify-start my-4 rounded-xl gap-6 pr-2" data-theme={theme}>
				<Image
					className="max-w-200 max-h-200 rounded-s-md"
					src={`${process.env.apihost}/api/images/${props.hash}`}
					width={200}
					height={120}
					alt="video recommendation thumbnail" /> 
				<div className="video-metadata flex flex-col items-start justify-center">
					<h1 className="text-left text-sm font-bold">{props.title}</h1>
					<span className="text-[13px]">{props.views} Views</span>
					<span className="text-[13px]">date: {
						formatTimestamp(new Date(props.publishedAt))
					}</span>
				</div>
			</div>
		</Link>
	)
}