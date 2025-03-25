import fs from 'node:fs'

export default class VideoDatabase {
	constructor(source) {
		if (source) {
			const data = fs.readFileSync(source, { encoding: 'utf-8' })
			this.videos = JSON.parse(data);
		}
		else this.videos = [];
	}

	findByHash(hash) {
		return this.videos.find(({ hash: h }) => h === hash) ?? {}
	}

	findAll() {
		return this.videos;
	}

	update(video) {
		let v = this.videos.find(({ hash }) => hash === video.hash)
		v = video;

		this.videos = this.videos.map(video => {
			if (video.hash === v.hash) {
				return v
			}

			return video			
		})
	}

	save({ title, hash, mimes }) {
		this.videos.push({
			title,
			hash,
			views: 0,
			mimes: {
				thumb: mimes.thumb,
				video: mimes.video,
			},
			publishedAt: new Date().toString()
		})
	}

	flush(filename) {
		fs.writeFileSync(filename, JSON.stringify(this.videos), { encoding: 'utf-8' })
	}
}