import busboy from 'busboy'
import fs from 'node:fs'
import path from 'node:path'
import { createHash }  from 'crypto'

export default class UploadService {
	/**
	 * @param {object} headers - request headers for busboy usage
	 * @param {string} destDir - root dir for the upload
	 * @endCallback {function} callback to be called when the file processings ends.
	 * */
	constructor({ headers, destDir }) {
		this.uploadRootDir = path.join(destDir, createHash('md5').update('' + Date.now()).digest('hex'))
		this.videoMetadata = {
			title: "",
			hash: path.basename(this.uploadRootDir),
			mimes: {
				thumb: "",
				video: ""
			}
		};
		this.bb = busboy({
			headers,
		})
	}

	createDirectories() {
		const dirs = [
			this.uploadRootDir, 
			this.uploadRootDir + '/thumbnail', 
			this.uploadRootDir + "/video"
		]

		dirs.forEach(dirname => {
			fs.mkdirSync(dirname, {
				recursive: true
			})
		})
	}

	defineHandlers(cb) {
		const savefield = (name, val, info) => this.videoMetadata.title = val;

		const store = (name, file, { filename, mimeType }) => {
			console.log(name, filename, mimeType);

			const allowedVideoMimeTypes = ["video/mp4", "video/mkv", "video/webm"]
			const getVideoMime = () => allowedVideoMimeTypes.find(f => mimeType === f) ?? 'video/mp4'
			const mime = getVideoMime()

			switch (name) {
			case "thumbnail":
				file.pipe(fs.createWriteStream(
					path.join(
						this.uploadRootDir,
						"thumbnail",
						"thumb." + mimeType.split('/')[1] ?? 'jpg'
					)
				));

				this.videoMetadata.mimes.thumb = mimeType
				break;

			case "video":
				file.pipe(fs.createWriteStream(
					path.join(
						this.uploadRootDir,
						"video",
						"video." + mime.split('/')[1] ?? 'mp4'
					)
				))

				this.videoMetadata.mimes.video = getVideoMime()
				break;
			}
			
			return;
		}

		this.bb.on("field", savefield.bind(this))
		this.bb.on("file", store.bind(this))
		this.bb.on('close', (() => cb(this.videoMetadata)).bind(this))
	}

	startUpload(request) {
		this.createDirectories()		

		return new Promise((resolve, reject) => {
			try {
				this.defineHandlers(resolve);
				request.pipe(this.bb)
			}
			catch(error) {
				reject(error)
			}
		})

	}
}