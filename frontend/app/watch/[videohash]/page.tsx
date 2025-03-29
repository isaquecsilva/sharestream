'use client'

import { 
	useRef, 
	useEffect,
	useState
} 
from 'react'
import { useParams } from 'next/navigation'
import Head from '@/app/components/head/head'
import Header from '@/app/components/header/header'
import Link from 'next/link'
import axios from 'axios'
import type { VideoCardProps } from '@/app/components/videocard/videocard'
import { formatTimestamp } from '@/app/lib/utils'
import { FaEye } from "react-icons/fa"
import VideoRecommendation from '@/app/components/recommendation/recommendation'

export default function WatchPage(request) {
	const [mainVideo, setMainVideo] = useState<VideoCardProps>({});
	const [recommendations, setRecommendations] = useState<VideoCardProps[]>([]);
	const [theme, setTheme] = useState<string|null>()
	const { videohash } = useParams()
	const updatedViewsRef = useRef<boolean>(false)
	
	useEffect(() => {
		updateViews()
		setTheme(localStorage.getItem('theme'))
		getVideos()
	}, [])

	useEffect(() => {
		if (theme) {
			localStorage.setItem('theme', theme)
		}

	}, [theme])


	function updateViews() {
		if (!updatedViewsRef.current) {
			const viewsEndpoint = `${process.env.apihost}/api/videos/${videohash}/views`
			axios.post(viewsEndpoint)
			updatedViewsRef.current = true
		}
	}

	function updateTheme() {
		setTheme(theme === 'coffee' ? 'light' : 'coffee')
	}

	function getVideos() {
		axios.get(`${process.env.apihost}/api/videos`)
			.then(({ data: videos }) => {
				// setting main video
				const v = videos.find(v => v.hash === videohash)
				if (v) {
					setMainVideo(v)
				}

				const otherVideos = videos.filter(({ hash }) => hash != videohash)
				console.log(otherVideos)
				setRecommendations(otherVideos)
			})
			.catch(error => {
				console.error(`[ERROR]: fetch-videos: ${error?.message ?? error}`)
			})
	}


	// `${process.env.apihost}/api/watch/${videohash}`

	return (
		<div data-theme={theme}>
		<Header {...{ theme, updateTheme }} data-theme={theme} />
		<Head title="ShareStream" href="/" theme={theme} />
		<div className="bg-yellow-500 w-full h-fit mt-8 py-8 flex flex-col items-center justify-center gap-2 lg:flex lg:flex-row lg:px-12 lg:items-start lg:justify-center lg:px-38">
			<div className="max-w-140 w-10/12 lg:w-8/12">
				<video src={`${process.env.apihost}/api/watch/${mainVideo.hash}`} className="max-w-135 rounded-xl outline-none" controls={true} autoPlay={true}>
					
				</video>
				<section className="metadata">
					<div className="video-metadata flex flex-col pl-2 pr-8">
						<h1 className="w-full max-w-full py-4 font-bold text-xl text-left text-black text-ellipsis truncate text-wrap line-clamp-2">{mainVideo.title}</h1>
						<div className="flex flex-row items-center justify-between text-black">
							<span><strong>published at:</strong> {formatTimestamp(new Date(mainVideo.publishedAt))}</span>
							<span className="space-x-4">{mainVideo.views} <FaEye className="inline"/></span>
						</div>
					</div>
				</section>
			</div>
			<div className="w-10/12 bg-none h-200 text-center lg:w-6/12">
				<h1 className="text-left font-bold text-gray-800 text-2xl">Recommended</h1>
				<div className="border-b-1 border-gray-800 my-4 max-w-8/10"></div>

				{recommendations.map((v, index) => {
					return <VideoRecommendation props={v} key={index}/> 
				})}
			</div>
		</div>
		</div>
	)
}