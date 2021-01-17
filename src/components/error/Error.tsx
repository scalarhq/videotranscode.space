import { ReloadSvg } from '@components/utils/reload'
import styles from '@styles/error.module.css'
import newGithubIssueUrl from 'new-github-issue-url'
import React from 'react'

const ErrorScreen = ({
  errorObj,
  componentStack
}: {
  errorObj?: Error
  componentStack?: string
}) => (
  <div className={styles['error-wrapper']}>
    <p
      className="text-3xl"
      style={{ color: 'white', textAlign: 'center', marginTop: '5vh' }}>
      Oops! Something went wrong
    </p>
    <p
      className="text-xl"
      style={{ color: 'white', textAlign: 'center', fontWeight: 'lighter' }}>
      Often, reloading the page will fix this error.
    </p>

    <div className={styles['error-icon']}>
      <button
        type="button"
        className={styles['transparent-button']}
        onClick={() => {
          window.location.reload()
        }}>
        <ReloadSvg width="15rem" />
      </button>
    </div>
    <div className={styles['error-message']}>
      <p style={{ color: 'white' }}>
        {errorObj?.message ? errorObj.message : 'Unknown Error'}
      </p>
      <pre style={{ color: 'white' }}>{componentStack}</pre>
      <p style={{ color: 'white', fontSize: '14px' }}>
        Your current browser version is {window.navigator.userAgent}
      </p>
      <p>
        Check the error message above and if you think something is wrong,
        please create an issue{' '}
        <a
          href={newGithubIssueUrl({
            user: 'Etwas-Builders',
            repo: 'Video-Transcoder',
            body: `\n\n\n-----\n Browser Version: ${
              window.navigator.userAgent
            } \n\n-----\n **Error Message : ${
              errorObj?.message ? errorObj.message : 'Unknown Error'
            }** \n\n-----\n Call Stack : ${componentStack}`,
            title: '[BUG] [CRASH]',
            labels: ['bug', 'crash-report']
          })}
          target="_blank"
          rel="noopener noreferrer">
          here
        </a>
      </p>
      <p>
        We support the following browsers, you can find the full detailed list{' '}
        <a
          href="https://caniuse.com/#feat=sharedarraybuffer"
          target="_blank"
          rel="noopener noreferrer">
          here
        </a>
      </p>
      <a
        href="https://caniuse.com/#feat=sharedarraybuffer"
        target="_blank"
        rel="noopener noreferrer">
        <picture className={styles['picture-wrapper']}>
          <source
            type="image/webp"
            srcSet="/images/support/browserSupport.webp"
          />
          <source
            type="image/png"
            srcSet="/images/support/browserSupport.png"
          />
          <img
            className={styles['img-class']}
            src="/images/support/browserSupport.jpg"
            alt="Data on support for the SharedArrayBuffer feature across the major browsers from caniuse.com"
          />
        </picture>
      </a>
    </div>
    <div className={styles.final} />
  </div>
)

export default ErrorScreen
