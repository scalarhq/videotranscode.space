import keyboardStore from '@store/keyboardStore'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Modfy!',
    text: [
      `
      <div class="flex flex-col">
      <p>
      This product is a completely browser-based video converter and compressor, which converts your video without uploading to any servers.
      </p>
      <strong class="tour-padding">
      This is a guided tour on how to use this product. Feel free to skip it at any time.
      </strong>
      </div>
      `
    ],
    classes: 'tour-welcome',
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
    attachTo: { element: '#dropzone-wrapper', on: 'right' },
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
    title: 'Settings',
    text: [
      `
      <div class="flex flex-col">
      <p>Choose your settings here!</p>
      <i class="tour-padding">Can use ALT+P or click on the right to get here.</i>
      </div>
      `
    ],
    beforeShowPromise: function () {
      return new Promise(resolve => {
        const { toggleModal } = keyboardStore
        if (toggleModal) {
          toggleModal()
          setTimeout(() => {
            resolve(true)
          }, 100)
        }
      })
    },
    when: {
      hide: () => {
        const { toggleModal } = keyboardStore
        if (toggleModal) {
          toggleModal()
        }
      }
    },
    attachTo: { element: '.settings-tour-highlight', on: 'right' },
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
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    text: [
      `
      <p>We have some basic keyboard shortcuts to make your life easier!</p>`
    ],
    beforeShowPromise: function () {
      return new Promise(resolve => {
        const { showShortcuts } = keyboardStore
        if (showShortcuts) {
          showShortcuts()
          setTimeout(() => {
            resolve(true)
          }, 100)
        }
      })
    },
    when: {
      hide: () => {
        const { showShortcuts } = keyboardStore
        if (showShortcuts) {
          showShortcuts()
        }
      }
    },
    attachTo: { element: '#keyboard-shortcuts-tour', on: 'left' },
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
    title: 'Advanced Mode',
    text: [
      `
      <p>Need more precise control? Try our Advanced mode!</p>`
    ],
    attachTo: { element: '.basic-feature-toggle', on: 'top' },
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

  // {
  //   id: 'configuration',
  //   title: 'Advanced Options (CLUI)',
  //   text: [
  //     `
  //     <>There are <strong>TWO</strong> primary types of settings available:</>
  //     <p><strong>Workflows</strong><p> A workflow is an automated series of features that are executed to give you a final video. <br /><i>An example of a workflow is to convert and then compress your video.</i></p></p>
  //     <p><strong>Features</strong><p> A feature is a single, specific task.<br /> <i>An example of a feature is just converting your video.</i></p></p>
  //     `
  //   ],
  //   attachTo: { element: '.configuration-wrapper', on: 'left' },
  //   buttons: [
  //     {
  //       type: 'back',
  //       classes: 'shepherd-button-secondary',
  //       text: 'Back'
  //     },
  //     {
  //       type: 'next',
  //       text: 'Next'
  //     }
  //   ]
  // },
  // {
  //   id: 'configuration',
  //   title: 'Advanced Options /2',
  //   text: [
  //     `
  //     <p>Use your <i>keyboard</i> to choose the specific feature, workflow, and settings you want, then hit <b>Submit</b> and Modfy will do all the hard work for you!</p>
  //     <p><i>Keep in mind that the larger the file or more complex the task, the longer Modfy will take to complete it.</i> </p>
  //     <p><i>Feel free to just leave the tab open and come back later!</i></p>
  //     `
  //   ],
  //   attachTo: { element: '.configuration-wrapper', on: 'left' },
  //   buttons: [
  //     {
  //       type: 'back',
  //       classes: 'shepherd-button-secondary',
  //       text: 'Back'
  //     },
  //     {
  //       type: 'complete',
  //       text: 'Done'
  //     }
  //   ]
  // }
]

export default steps
