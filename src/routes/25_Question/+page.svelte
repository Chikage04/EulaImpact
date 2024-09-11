<script>
  import Game from '$lib/game.svelte';
  import Game25 from '$lib/game25.svelte'
</script>

<main>
  <h1>Quiz: Qui est le plus grand ?</h1>
  <Game25 />
  <div class="navigation">
    <a href="/">10 Questions</a>
    <a href="/50_Question">50 Questions</a>
  </div>
</main>

<style>
  main {
    text-align: center;
    margin: 20px;
  }

  .navigation {
    margin-top: 40px;
  }

  a {
    font-size: 1.1rem;
    color: white;
    background-color: #667eea;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;
  }

  a:hover {
    background-color: #4c51bf;
  }
</style>