'use client'

import { IoIosArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import Link from 'next/link'
import UploadButton from '@/app/components/uploadbutton/uploadbutton.tsx'
import Header from '@/app/components/header/header.tsx'
import Head from '@/app/components/head/head.tsx'

export default function UploadPage(): React.ReactElement {
    const [theme, setTheme] = useState<string|null>('')
    const uploadEndpoint: string = process.env.apihost + "/api/upload";
    console.log('server', uploadEndpoint)

    useEffect(() => {
        let currentTheme = localStorage.getItem('theme')
        if (currentTheme != 'light' && currentTheme != 'coffee') {
            currentTheme = 'light'
        }

        setTheme(currentTheme);

    }, [])

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])

    function updateTheme() {
        setTheme(theme === 'light' ? 'coffee' : 'light')
    }

    return (
        <>
        <Header {...{ theme, updateTheme }} />
        <Head {...{ theme, title: "ShareStream", href: "/" }} />
        <main data-theme={theme}>
            <div className="w-full h-screen flex items-center justify-center flex-col bg-accent-800">
                <form method="POST" encType="multipart/form-data" action={uploadEndpoint} className={`border border-1 shadow-xl border-gray-300 rounded-2xl flex flex-col min-w-100 max-w-6/12 mx-auto items-center justify-center shadow-md p-8 gap-4 ${theme != 'light' ? 'bg-slate-800' : 'bg-white'}`} >
                    <h1 className={`font-bold ${theme == 'light' ? 'text-gray-700' : 'text-white'} text-center text-5xl my-8`}>File Upload</h1>

                    <label htmlFor="title" className="w-[96%]">
                        <p className="font-semibold my-2 text-gray-600">Video Title</p>
                        <input name="title" id="title" className="w-full input input-accent input-md" type="text" placeholder="Video Title" />
                    </label>

                    <label htmlFor="select-thumb">
                        <p className="font-semibold my-2 text-gray-600">Thumbnail</p>
                        <input name="thumbnail" id="select-thumb" className="w-full file-input file-input-accent" type="file" accept=".png,.jpg,.jpeg"/>
                    </label>

                    <label htmlFor="select-video">
                        <p className="font-semibold my-2 text-gray-600">Video</p>
                        <input name="video" id="select-video" className="w-full file-input file-input-accent file-input-md" type="file" accept=".mp4"/>
                    </label>

                    <input type="submit" value={"Upload"} className="btn btn-neutral min-w-30 mt-8" />
                </form>
            </div>
        </main>
        </>
    )
}