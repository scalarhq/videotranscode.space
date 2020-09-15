import React from 'react';

import { Footer } from './static';

const AboutPage = () => (
  <div className="about-wrapper">
    <h1 className="title">Browser Based Video Transcoder</h1>
    <div className="sections">
      <div className="what">
        <h3 className="sub-title">$ What is a Browser Based Video Transcoder?</h3>
        <p>
          {'>'}
          {' '}
          A Browser Based Video Transcoder is a fancy way of saying that we process video/audio on your browser. To elaborate, we are not processing these video files in a server like conventional video tools on the internet;rather, we are using your own computer and browser to process these files.
          {' '}
        </p>
      </div>
      <div className="how">
        <h3 className="sub-title">$ How is this different to other tools?</h3>
        <p>
          {'>'}
          {' '}
          The main difference is that your video file never leaves your computer, all the processing is completely done on your system. This is possible as a result of
          {' '}
          <a
            href="https://webassembly.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Assembly

          </a>
          , which allows us to recompile desktop tools to work within the browser(this is an over simplification). Specifically, we are using
          {' '}
          <a
            href="https://ffmpeg.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            FFmpeg.

          </a>
        </p>
      </div>
      <div className="why">
        <h3 className="sub-title">$ Why is this tool important? </h3>
        <p>
          {'>'}
          {' '}
          We think this tool is important, because we think your privacy is important. While most video processing sites claim to protect your privacy there is no way to know for sure, but our tool has no server and is completely open-source. So you do not have to take our word but can check for yourself.
        </p>
        <p>
          {'>'}
          {' '}
          Additionally, this tool is completely modular with a
          {' '}
          <a
            href="https://blog.repl.it/clui"
            target="_blank"
            rel="noopener noreferrer"
          >
            CLUI

          </a>
          {' '}
          design, which allows the community to add workflows and features on their own, which allows users to complete complex tasks with a single click.
        </p>
      </div>
      <div className="abilities">
        <h3 className="sub-title">$ What can it do?</h3>
        <p>
          {'>'}
          {' '}
          Our goal with this project is to be able to do everything FFmpeg can do and more, but as the project is in its early stages the number of supported features are limited but ever growing. A full list of features is available
          {' '}
          <a
            href="https://docs.videotranscode.space/modules/_features_features_.html#features"
            target="_blank"
            rel="noopener noreferrer"
          >
            in our docs!
          </a>
          {' '}
          But you can always just explore features on the CLUI and find them.
        </p>
        <p>
          The tools most commonly used features are :
          <ul>
            <li>Converting Video Formats(Transcoding)</li>
            <li>Reducing Size of Video(Compressing)</li>
            <li>Make Montages of Photos</li>
            <li>Change Aspect Ratio of Videos</li>
            <li>Combine Videos(Concating)</li>
          </ul>
        </p>
      </div>

      <div className="final" />
      <Footer />
    </div>
    {/* @ts-ignore Styled JSX */}
    <style jsx>
      {`
      .about-wrapper {
         flex: 1 0 auto;
         overflow: auto;
      }
      .sections {
        display : flex;
        flex-direction : column;
        max-width: 50vw;
        
      }
      .final {
        padding-bottom: 20vh;
      }
      .title {
        font-weight: 400;
        font-size: 46px;
      }
      .sub-title {
        font-weight: 400;
      }
      a {
        color : #ff3e00
      }
      ul {
        list-style-type: circle !important;
        all : revert;
         
      }
      li {
        background-color: transparent;
      }
      `}

    </style>
  </div>
);

export default AboutPage;
