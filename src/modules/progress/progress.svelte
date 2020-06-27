<script lang="ts">
  import { onMount } from "svelte";
  import { progressStore, progressType } from "../../store/stores";

  export let progressTitle = "";

  export let progress: number = $progressStore;
  let progressBar;
  onMount(() => {
    progressBar = document.getElementById("progress");
    progressType.subscribe((value: "Transcode" | "Compress") => {
      if (value === "Transcode") {
        progressTitle = "Transcoding...";

        progressBar ? (progressBar.style.backgroundColor = "#0d6efd") : null;
      } else {
        progressTitle = "Compressing...";
        if (progressBar) {
          console.info("Pre Color Update");
          progressBar.style.backgroundColor = "#3FBD71";
          console.info("Updated", progressBar);
        }
      }
    });
  });

  progressStore.subscribe(value => {
    progress = value;
    if (progressBar) {
      if (progress > 1) {
        progress = 20 + 0.4 * progress * Math.log10(progress);
        progressBar.style.width = `${progress}%`;
      }
    }
  });
</script>

<style>
  .bg-danger {
    background-color: #dc3545 !important;
  }
  .progress-wrapper {
    display: flex;
    margin: auto;
    width: 30vh;
  }
  .row {
    flex-direction: row;
    justify-content: center;
  }

  @-webkit-keyframes progress-bar-stripes {
    0% {
      background-position-x: 1rem;
    }
  }

  @keyframes progress-bar-stripes {
    0% {
      background-position-x: 1rem;
    }
  }

  .progress {
    display: flex;
    height: 1rem;
    overflow: hidden;
    font-size: 0.75rem;
    background-color: #e9ecef;
    border-radius: 0.25rem;
    width: 100%;
  }

  .progress-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    background-color: #0d6efd;
    transition: width 0.6s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-bar {
      transition: none;
    }
  }

  .progress-bar-striped {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }

  .progress-bar-animated {
    -webkit-animation: progress-bar-stripes 1s linear infinite;
    animation: progress-bar-stripes 1s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-bar-animated {
      -webkit-animation: none;
      animation: none;
    }
  }
</style>

<div class="row">
  <h3>{progressTitle}</h3>
</div>
<div class="progress-wrapper">

  <div class="progress">
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar"
      id="progress"
      aria-valuenow="0"
      aria-valuemin="0"
      aria-valuemax="100"
      style="width: 20%">
      {progress.toFixed(2)}%
    </div>
  </div>
</div>
