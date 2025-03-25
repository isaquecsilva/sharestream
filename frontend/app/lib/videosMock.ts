import { VideoCardProps } from "../components/videocard/videocard";

export const generateCardMocks = (size: number = 12): Array<VideoCardProps> => {
    function randomHash(): string {
        let hash: string = '';
        for (let i = 0; i < 8; i++) {
            let char = Math.floor(Math.random() * (122-65)) + 65;
            hash += String.fromCharCode(char);
        }

        return hash
    }

    let videos = new Array<VideoCardProps>(size)
        .fill({} as VideoCardProps)
        .map(() => {
            return {
                title: 'Chicken crossing the road',
                thumbnail: 'https://colleenthornton.com/wp-content/uploads/2020/05/chickenxroad.jpg',
                views: 8,
                publishedAt: new Date(Date.now() - 10000),
                hash: randomHash()
            }
        });

    return videos;
}