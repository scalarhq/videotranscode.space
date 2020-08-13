import React from 'react';

const AboutPage = () => (
  <div className="about-wrapper">
    <h1 className="title">Browser Based Video Transcoder</h1>
    <div className="sections">
      <div className="what">
        <h3 className="sub-title">$ What is a Based Video Transcoder?</h3>
        <p>
          {'>'}
          {' '}
          A Browser Based Video Transcoder is a fancy way of saying that we process video/audio on your browser. To elaborate, we are not processing these video files in a server like conventional video tools on the internet. But rather are using your own computer and browser to process these files.
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
    </div>
    {/* @ts-ignore Styled JSX */}
    <style jsx>
      {`
      .sections {
        display : flex;
        flex-direction : column;
        max-width: 50vw;
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
      `}

    </style>
  </div>
);

export default AboutPage;
