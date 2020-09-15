export default [
  {
    id: 'welcome',
    title: 'Welcome to Modfy!',
    text: [
      `
      <p>
      This product is a completely browser based video converter and compressor, which converts your video without uploading to any servers
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
      'Just upload the files you want to process! You can upload video, audio, and image files.',
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
      <p>The CLUI is where you can choose your settings.</p>
      <p> It is a mix between a graphical interface and a terminal, which give it super powers in the number of options it has.</p>
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
      <p>If you'd prefer not to use the CLUI, just click the toggle to switch to Basic Mode!</p>`,
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
      <p>There are <strong>TWO</strong> primary types of settings available:</p>
      <p><strong>Workflows</strong><p> A workflow is an automated series of features that are executed to give you a final video. <br /><i>An example of a workflow is to convert and then compress your video.</i></p></p>
      <p><strong>Features</strong><p> A single one of feature to do a single specific task.<br /> <i>An example of a feature is just converting your video.</i></p></p>
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
      <p>Use your keyboard to choose the specific feature, workflow, and settings you want, then hit Submit and Modfy will do all the hard work for you!</p>
      <p>Keep in mind that the larger the file or more complex the task, the longer Modfy will take to complete it. </p>
      <p>Feel free to just leave the tab open and come back later!</p>
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
