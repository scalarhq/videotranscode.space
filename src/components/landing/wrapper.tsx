import React from 'react';

import Header from './header';
import Main from './main';

import './css/main.css';

const Article = ({ id, title }: { [name: string]: string }) => null;

const Wrapper = () => (
  <div id="wrapper">
    <Header />
    <Main>
      <Article
        id="intro"
        title="Intro"
        img="/images/pic01.jpg"
        alt="some image01"
        text="Aenean ornare velit lacus, ac varius enim ullamcorper eu. Proin aliquam facilisis ante interdum congue. Integer mollis, nisl amet convallis, porttitor magna ullamcorper, amet egestas mauris. Ut magna finibus nisi nec lacinia. Nam maximus erat id euismod egestas. By the way, check out my <a href='#work'>awesome work</a>"
      />
      <Article
        id="work"
        title="Work"
        img="/images/pic02.jpg"
        alt="some image02"
        text="Adipiscing magna sed dolor elit. Praesent eleifend dignissim arcu, at eleifend sapien imperdiet ac. Aliquam erat volutpat. Praesent urna nisi, fringila lorem et vehicula lacinia quam. Integer sollicitudin mauris nec lorem luctus ultrices."
      />
      <Article
        id="about"
        title="About"
        img="/images/pic03.jpg"
        alt="some image03"
        text="Lorem ipsum dolor sit amet, consectetur et adipiscing elit. Praesent eleifend dignissim arcu, at eleifend sapien imperdiet ac. Aliquam erat volutpat. Praesent urna nisi, fringila lorem et vehicula lacinia quam. Integer sollicitudin mauris nec lorem luctus ultrices. Aliquam libero et malesuada fames ac ante ipsum primis in faucibus. Cras viverra ligula sit amet ex mollis mattis lorem ipsum dolor sit amet."
      />
      <Article id="contact" title="Contact" />
    </Main>
  </div>
);

export default Wrapper;
