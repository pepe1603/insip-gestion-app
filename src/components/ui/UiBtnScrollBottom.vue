<style scoped>
  /* <reset-style> ============================ */
  a {
    text-decoration: none;
  }
  /* <main-style> ============================ */
  .main__scroll-text {
    color: rgba(28,28,30,1);
  }

  .main__action:hover .main__scroll-box {
    animation: scroll-down 3s infinite;
  }

  /* Animate scroll icon */
  @keyframes scroll-down {
    0%, 100% {
      transform: translateY(0rem);
      opacity: 1;
    }

    35% {
      transform: translateY(1rem);
      opacity: 0;
    }

    70% {
      transform: translateY(-1rem);
      opacity: 0;
    }
  }
</style>

<template>
  <div class="main__action">
    <a class="main__scroll" href="#">
      <div class="main__scroll-box">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    	    <path d="M0 0h24v24H0z" fill="none"></path>
    	    <path d="M11.9997 13.1716L7.04996     8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z" fill="rgba(28,28,30,1)">
    	    </path>
  	  </svg>
      </div>

      <span class="main__scroll-text">Scroll</span>
    </a>
  </div>
</template>

