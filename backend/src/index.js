import express from 'express'
import path from 'node:path'
import { statSync, readdirSync, readFileSync, createReadStream } from "node:fs"
import { config } from 'dotenv'
config();

import cors from 'cors';
import UploadService from './upload/uploadService.js';
import VideoDatabase from './database/database.js';

const PORT = parseInt(process.env.PORT) || 9119

const database = new VideoDatabase("database.json")
const app = express();

app.use(cors())

app.get('/ping', async (req, res) => res.end('pong'))

app.get('/api/images/:thumb_hash', async function(req, res) {
	const { thumb_hash } = req.params;

	const video = database.findByHash(thumb_hash);

	if (!!Object.entries(video).length != true) {
		return res.writeHead(404, {
			'content-type': 'application/json'
		})
		.end(JSON.stringify({
			error: true,
			message: 'not found'
		}))
	}

	let fullThumbPath = path.join(process.cwd(), "files", thumb_hash, "thumbnail")
	let files = readdirSync(fullThumbPath)

	if (files?.length) {
		fullThumbPath += '/' + files[0];
	}

	res.setHeader('content-type', video.mimes.thumb)
	res.statusCode = 200
	createReadStream(fullThumbPath).pipe(res)
})

app.get('/api/watch/:videohash', async (req, res) => {
	if (!req.headers['range']) {
		return res.writeHead(400, {
			'content-type': 'text/plain'
		})
		.end('missing range header')
	}

	const { videohash } = req.params;

	function getVideoPath() {
		const video = database.findByHash(videohash);

		if (!!Object.entries(video).length != true) {
			return [
				{
					error: true,
					message: 'not found'
				},
				video
			]
		}

		let fullVideoPath = path.join(process.cwd(), "files", videohash, "video")
		let files = readdirSync(fullVideoPath)

		if (files?.length) {
			fullVideoPath += '/' + files[0];
		}

		return [
			{
				error: false,
				message: fullVideoPath
			},
			video
		]
	}

	const [videoPath, video] = getVideoPath()

	if (videoPath.error) {
		res.statusCode = 404
		return res.json(videoPath.message)
	}

	function calculateRange(filepath) {
		const { size } = statSync(filepath);
		let start = parseInt(req.headers.range.match(/\d+/)[0]);
		let end = Math.min(start + (10**6 - 1), size - 1)
		return [start, end, size]
	}

	const [start, end, size] = calculateRange(videoPath.message)

	const stream = createReadStream(videoPath.message, {
		start,
		end
	})

	res.setHeader('accept-range', 'bytes')
	res.setHeader('content-range', `bytes ${start}-${end}/${size}`)
	res.setHeader('content-length', end - start + 1)
	res.setHeader('content-type', video.mimes.video)
	res.statusCode = 206
	stream.pipe(res)
})

app.post('/api/videos/:videohash/views', async function(req, res) {
	const { videohash } = req.params;
	const video = database.findByHash(videohash)

	if (!!Object.entries(video).length != true) {
		return res.writeHead(404, {
			'content-type': 'application/json',
			'cache-control': 'no-store, no-cache, must-revalidate'
		})
		.end({
			error: true,
			message: 'not found'
		})
	}

	video.views++;
	database.update(video)
	database.flush('database.json')
	res.writeHead(204).end();
})

app.get('/api/videos', async (req, res) => {
	const videos = database.findAll()

	return res.writeHead(200, {
		'content-type': 'application/json',
		'cache-control': 'no-store, no-cache, must-revalidate'
	})
	.end(JSON.stringify(videos))
})

app.post('/api/upload', async (req, res) => {
	const us = new UploadService({
		headers: req.headers,
		destDir: path.join(process.cwd(), 'files'),
	})

	const { title, hash, mimes } = await us.startUpload(req)
	database.save({
		title,
		hash,
		mimes
	})

	res.setHeader('content-type', 'text/plain')
	res.setHeader('location', process.env.FRONTEND_HOST)
	res.statusCode = 302
	res.end('file uploaded!')
	database.flush('database.json');
})

app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
})