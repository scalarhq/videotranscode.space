const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Modfy!',
    text: [
      `
      <p>
      This product is a completely browser-based video converter and compressor, which converts your video without uploading to any servers.
      </p>
      <strong>
      This is a guided tour on how to use this product. Feel free to skip it at any time.
      </strong>
      `
    ],
    classes: 'shepherd shepherd-welcome',
    buttons: [
      {
        type: 'cancel',
        classes: 'shepherd-button-secondary',
        text: 'Exit'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'files',
    title: 'Adding Files',
    text: [
      'Just upload the files you want to process! You can upload video, audio, and image files.'
    ],
    attachTo: { element: '.dropzone-wrapper', on: 'bottom' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'configuration',
    title: 'Basic Features',
    text: [
      `
      <p>Choose your features here!</p>
      `
    ],
    attachTo: { element: '.configuration-wrapper', on: 'left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'basic-features',
    title: 'Want to use advanced features?',
    text: [
      `
      <p>You want access all the features? Use our CLUI</p>`
    ],
    attachTo: { element: '.basic-feature-toggle', on: 'top' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'configuration',
    title: 'Advanced Options (CLUI)',
    text: [
      `
      <p>There are <strong>TWO</strong> primary types of settings available:</p>
      <p><strong>Workflows</strong><p> A workflow is an automated series of features that are executed to give you a final video. <br /><i>An example of a workflow is to convert and then compress your video.</i></p></p>
      <p><strong>Features</strong><p> A feature is a single, specific task.<br /> <i>An example of a feature is just converting your video.</i></p></p>
      `
    ],
    attachTo: { element: '.configuration-wrapper', on: 'left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'configuration',
    title: 'Advanced Options /2',
    text: [
      `
      <p>Use your <i>keyboard</i> to choose the specific feature, workflow, and settings you want, then hit <b>Submit</b> and Modfy will do all the hard work for you!</p>
      <p><i>Keep in mind that the larger the file or more complex the task, the longer Modfy will take to complete it.</i> </p>
      <p><i>Feel free to just leave the tab open and come back later!</i></p>
      `
    ],
    attachTo: { element: '.configuration-wrapper', on: 'left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'complete',
        text: 'Done'
      }
    ]
  }
]

export default steps
