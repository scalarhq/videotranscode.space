export default [
  {
    id: 'welcome',
    title: 'Welcome to VideoTranscode.space',
    text: [
      `
      <p>
      This product is a completely browser based video convert and compressor, which converts your video without uploading to any servers
      </p>
      <strong>
      This is a guided tour on how to use this product, feel free to skip it at any time.
      </strong>
      `,
    ],
    classes: 'shepherd shepherd-welcome',
    buttons: [
      {
        type: 'cancel',
        classes: 'shepherd-button-secondary',
        text: 'Exit',
      },
      {
        type: 'next',
        text: 'Next',
      },
    ],
  },
  {
    id: 'files',
    title: 'Adding Files',
    text: [
      'Simply drag and drop as many files as you want to process, we accept video, audio and image files',
    ],
    attachTo: { element: '.dropzone-wrapper', on: 'bottom' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back',
      },
      {
        type: 'next',
        text: 'Next',
      },
    ],
  },
  {
    id: 'settings',
    title: 'The CLUI',
    text: [
      `
      <p>The CLUI is where you can choose your settings</p>
      <p> It is a mix between a graphical interface and a terminal, which give it super powers in the number of options it has </p>
      `,
    ],
    attachTo: { element: '.clui-wrapper', on: 'left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back',
      },
      {
        type: 'next',
        text: 'Next',
      },
    ],
  },
  {
    id: 'basic-features',
    title: 'Feel Intimated by the CLUI?',
    text: [
      `
      <p>We understand the CLUI is not for everyone, so here is a normal settings video with the most essential options</p>`,
    ],
    attachTo: { element: '.basic-feature-toggle', on: 'top' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back',
      },
      {
        type: 'next',
        text: 'Next',
      },
    ],
  },
  {
    id: 'clui-options',
    title: 'Choosing Settings',
    text: [
      `
      <p>There are <strong>TWO</strong> primary types of settings available</p>
      <p><strong>Workflows</strong><p> A workflow is an automated series of features that are executed to give you a final video. <br /><i>Example of a workflow is to convert and compress your video</i></p></p>
      <p><strong>Features</strong><p> A single one of feature to do a single specific task.<br /> <i>Example of a feature is just converting your video</i></p></p>
      `,
    ],
    attachTo: { element: '.clui-wrapper', on: 'left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back',
      },
      {
        type: 'next',
        text: 'Next',
      },
    ],
  },
  {
    id: 'clui-options',
    title: 'Choosing Settings /2',
    text: [
      `
      <p>After choosing the type of settings you want, <strong>choose the specific feature/workflow</strong> (Hint: use your keyboard)</p>
      <p>After choosing the specific feature/workflow, just click through the settings you want or leave it on default.</p>
      <p><strong>Finally hit Submit and wait!</strong></p>
      <p><i>Note: The larger the file and more complex the task, the longer the wait. Just leave the tab open and come back in a while!</i></p>
      `,
    ],
    attachTo: { element: '.clui-wrapper', on: 'left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back',
      },
      {
        type: 'complete',
        text: 'Done',
      },
    ],
  },
];
