import Image from 'next/image'
import { FaEye } from "react-icons/fa";
import { ThemeContext } from '@/app/lib/context';
import { useContext } from 'react';
import Link from 'next/link'
import { formatTimestamp } from "@/app/lib/utils"

export interface VideoCardProps {
	title: string,
	publishedAt: Date,
	views: number,
	hash: string
}

export default function VideoCard(props: VideoCardProps): React.ReactElement {
	const currentTheme = useContext(ThemeContext)
	let borderThickness = currentTheme != 'light' ? 'border-0' : 'border-2';

	return (
		<Link href={`/watch/${props.hash ?? ''}`} target='_self'>
			<div className={`card shadow-md bg-none border ${borderThickness} border-solid border-gray-300 hover:cursor-pointer hover:scale-101 w-80 h-70`}>
				<figure>
					<Image 
						className="rounded-t-sm w-full"
						src={`${process.env.apihost}/api/images/${props.hash}`}
						alt="video thumbnail" 
						width={200}
						height={200}/>
				</figure>
				<div className="card-body">
					<div className="card-title flex flex-col items-start">
						<h1 className="font-bold">{props.title}</h1>
						<div className="flex flex-row justify-between text-sm w-full">
							<span>{formatTimestamp(new Date(props.publishedAt))}</span>
							<span className="flex flex-row items-center gap-2">
								{props.views} 
								<FaEye/>
							</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

