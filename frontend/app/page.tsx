'use client'

import Header from "@/app/components/header/header";
import Head from "@/app/components/head/head";
import VideoCard from '@/app/components/videocard/videocard'
import { useState, useEffect } from 'react'
import { ThemeContext } from '@/app/lib/context'
import { generateCardMocks } from "@/app/lib/videosMock";
import axios from 'axios'

export default function Home() {
    const [theme, setTheme] = useState<string|null>('light');
    const [videos, setVideos] = useState([]);

    useEffect(() => {
      setTheme(localStorage.getItem("theme"))
      getVideos()
    }, [])

    function updateTheme() {
      let newTheme = theme == 'light' ? 'coffee' : 'light'
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }

    async function getVideos() {
      const endpoint = `${process.env.apihost}/api/videos`;
      const { data } = await axios.get(endpoint)
      console.log(data)
      setVideos(data.map(({ title, hash, views, publishedAt }) => {
        return {
          title, hash, views, publishedAt
        }
      }))
    }

    function orderByViewsCount(a, b) {
      return a.views > b.views ? -1 : 1;
    }

    return (
    <>
    <Header {...{ theme, updateTheme }} data-theme={theme} />
    <div className="w-full h-full py-6" data-theme={theme}>
      <Head title={"All Videos"} href="/" />
      <main className="flex items-center justify-center">
        <div className="min-w-9/12 max-w-10/12 flex flex-row flex-wrap p-8 gap-8 items-center justify-center">
          {videos.sort(orderByViewsCount).map(props => {
            return (
              <ThemeContext.Provider value={theme} key={props.hash}>
                <VideoCard {...props} key={props.hash} />
              </ThemeContext.Provider>
            )
          })}
        </div>
      </main>
    </div>
    </>
  );
}
