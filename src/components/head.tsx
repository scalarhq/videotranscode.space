import NextHead from 'next/head'
import React from 'react'

const Head = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NextHead>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <title>Modfy - Wasm Video Transcoder</title>

        <meta
          property="og:keywords"
          content="Video Convertor,Video Compressor,Video Transcoder, MP4, MOV, WebM,AVI,WMV, WASM, Web Assembly, FFmpeg, Privacy"
        />
        <meta property="og:author" content="Rahul Tarak(CryogenicPlanet)" />
        <meta
          property="og:title"
          content="Modfy - Wasm Video Compressor/Transcoder"
        />
        <meta
          property="og:image"
          content="https://modfy.video/images/banner.png"
        />
        <meta
          property="twitter:image"
          content="https://modfy.video/images/banner.png"
        />

        <meta
          property="og:description"
          content="A privacy first web assembly based video toolkit directly in the browser."
        />
        <meta property="og:url" content="https://modfy.video/" />

        <meta
          property="keywords"
          content="Video Convertor,Video Compressor,Video Transcoder, MP4, MOV, WebM,AVI,WMV, WASM, Web Assembly, FFmpeg, Privacy"
        />
        <meta property="author" content="Rahul Tarak(CryogenicPlanet)" />
        <meta
          property="title"
          content="Modfy - Wasm Video Compressor/Transcoder"
        />
        <meta
          property="image"
          content="https://modfy.video/images/banner.png"
        />
        <meta
          property="description"
          content="A privacy first web assembly based video toolkit directly in the browser."
        />
        <meta property="url" content="https://modfy.video/" />

        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      {children}
    </div>
  )
}

export default Head
