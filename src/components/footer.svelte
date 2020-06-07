<style>
  .footer {
    position: fixed;
    left: 0;
    bottom: 2%;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .icon {
    font-size: 3rem;
    color: white;
  }
  .extra {
    color: white;
    flex: 0 0 auto;
    width: 30vh;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
</style>

<div class="footer">
  <a
    href="https://github.com/Mozilla-Open-Lab-Etwas/Video-Transcoder"
    target="_blank"
    rel="noopener noreferrer"
    class="icon">
    <i class="fa fa-github" />
  </a>
  <div class="wasm-wrapper">
    <div class="extra">
      <p style="font-size : 20px; padding-right : 3%;">Powered by</p>
      <a
        href="https://webassembly.org/"
        target="_blank"
        rel="noopener noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          fill="#654ff0">
          <path
            d="M39.32 0v.345a7.34 7.34 0 0 1-7.338 7.338A7.34 7.34 0 0 1
            24.644.345V0H0v64h64V0zm-8.778 57.15l-3.116-15.42h-.054L24
            57.15h-4.294L14.84 34.493h4.24l2.902
            15.42h.054l3.497-15.42H29.5l3.14 15.6h.054l3.312-15.6h4.163L34.765
            57.15zm23.347 0l-1.445-5.043h-7.63l-1.112
            5.043h-4.24l5.483-22.657h6.7L58.31 57.15zm-4.607-17.074h-1.784l-1.85
            8.314h5.757z" />
        </svg>
      </a>
    </div>
  </div>
</div>
