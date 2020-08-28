import React, { useEffect } from 'react';

import Header from './header';
import Main from './main';

import './css/main.css';

const Article = ({ id, title }: { [name: string]: string }) => null;

const Wrapper = ({ loadFFmpeg }: { loadFFmpeg: Function }) => {
  useEffect(() => {
    loadFFmpeg();
  }, []);

  return (
    <div id="wrapper">
      <Header />
      <Main>
        <Article
          id="why"
          title="Why Should I care about this product?"
          img="/images/pic01.jpg"
          alt=""
          text={'<h1 style="color:white;">- Privacy</h1><b class="highlight-white">Video often contains super sensitive and private information</b>, which causes a problem when trying to use manipulate video online. The servers used to manipulate video <b class="highlight">could store your video or even inject malware to it.</b> <h2>The Solution?</h2> <p>Yes, you could always use editing software like premiere or final cut pro X. <b style="color:white;">But this software is expensive and hard to learn.</b> Or you could use command line tools like FFmpeg, <b style="color:white;">but this can be intimidating for the average person.</b></p> <p><b class="highlight-white">This product splits the difference</b> by processing the video on your browser <b class="highlight-white">you completely maintain your privacy.</b> </p> <h1 style="color:white;">- Data Consumption/Bandwidth</h1> <p>For a video to be manipulated online, you first have to upload the full video, then after processing have to download the processed video.</p> <p>Taking a example video of <b class="highlight-white">200mb</b>, that is <b class="highlight-white">400mb</b> in data consumption. Which does not seem like much, until you consider this will only increase the larger the file is.</p><p>On the other hand, this product only needs to download <b class="highlight-white">25mb</b> regardless of the size of the video, this can be game changing in areas <b class="highlight-white">with low bandwidth or slow internet connection.</b></p> '}
        />
        <Article
          id="features"
          title="Features"
          img="/images/pic02.jpg"
          alt=""
          text={'<ul class="features-list"><li class="highlight-white"><b>100% private video manipulation(Videos never leaves your machine)</b></li><li class="highlight-white"><b>Much Lower Data Consumption(Max 25 MB)</b></li><li class="highlight-white">Convert video from any format</li><li class="highlight-white">Compress video</li><li class="highlight-white">Community Workflows!</li><li class="highlight-white">Complete Modular Design with CLUI</li><li class="highlight-white">Fully Open Source!</li></ul>'}
        />
        <Article id="contact" title="Contact" />
      </Main>
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
        .highlight-white {
          color: white;
        }
        .features-list {
	        list-style: disclosure-closed;
        }
        `}
      </style>
    </div>
  );
};

export default Wrapper;
