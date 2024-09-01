<script>
  import { onMount } from "svelte";
  import charactersData from './characters.json';

  let score = 0;
  let questionCount = 0;
  let currentPair = [];
  let gameOver = false;
  let scoreMax = 25;

  // Récupère les personnages du fichier JSON
  const characters = charactersData?.characters || [];

  // Pour stocker les paires déjà utilisées
  let usedPairs = new Set();

  // Fonction pour générer une clé unique pour une paire de personnages
  function generatePairKey(char1, char2) {
    return [char1.name, char2.name].sort().join('|');
  }

  // Fonction pour choisir une paire de personnages aléatoire qui n'a pas été utilisée
  function getUniqueRandomPair() {
    if (characters.length < 2) {
      console.error("Pas assez de personnages dans le fichier JSON pour créer des paires.");
      return [null, null];
    }

    let attempts = 0;
    let pair;

    do {
      pair = getRandomPair();
      attempts++;
    } while (usedPairs.has(generatePairKey(pair[0], pair[1])) && attempts < 100);

    if (attempts < 100) {
      usedPairs.add(generatePairKey(pair[0], pair[1]));
      return pair;
    } else {
      console.error("Impossible de trouver une paire unique après plusieurs tentatives.");
      return [null, null];
    }
  }

  // Fonction pour obtenir deux personnages aléatoires
  function getRandomPair() {
    const shuffled = characters.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }

  // Initialiser la première paire de personnages
  onMount(() => {
    currentPair = getUniqueRandomPair();
  });

  // Fonction appelée lorsqu'un choix est fait
  function handleChoice(choice) {
    if (currentPair.length < 2) {
      console.error("currentPair ne contient pas assez de personnages.");
      return;
    }

    const [char1, char2] = currentPair;
    const correct = char1.height_cm > char2.height_cm ? char1.name : char2.name;

    if (choice === correct) {
      score++;
    }

    questionCount++;
    if (questionCount >= scoreMax) {
      gameOver = true;
    } else {
      currentPair = getUniqueRandomPair();
    }
  }

  // Redémarrer le quiz
  function restartQuiz() {
    score = 0;
    questionCount = 0;
    gameOver = false;
    usedPairs.clear(); // Réinitialiser les paires utilisées
    currentPair = getUniqueRandomPair();
  }
</script>

<main>
  <h1>Qui est le plus grand ?</h1>
  {#if !gameOver}
    <p class="score">Score: {score} / {scoreMax}</p>
    {#if currentPair[0] && currentPair[1]}
      <div class="question">
        <p>Qui est le plus grand entre {currentPair[0].name} et {currentPair[1].name} ?</p>
        <button on:click={() => handleChoice(currentPair[0].name)}>
          {currentPair[0].name}
        </button>
        <button on:click={() => handleChoice(currentPair[1].name)}>
          {currentPair[1].name}
        </button>
      </div>
    {:else}
      <p>Erreur : Les données des personnages sont manquantes ou incorrectes.</p>
    {/if}
  {:else}
    <p class="game-over">Votre score final est de {score} sur {scoreMax}.</p>
    <button class="restart-btn" on:click={restartQuiz}>Recommencer le quiz</button>
  {/if}
</main>

<style>
  /* Style général du corps */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #333;
  }

  main {
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    text-align: center; 
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #1e3a8a;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: #4a5568;
  }

  .question {
    margin: 30px 0;
  }

  button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 15px 25px;
    font-size: 1.1rem;
    cursor: pointer;
    margin: 10px 5px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  button:active {
    transform: translateY(1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }

  .score {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 25px;
  }

  .game-over {
    font-size: 1.8rem;
    color: #e53e3e;
    margin-bottom: 20px;
  }

  .restart-btn {
    background: linear-gradient(135deg, #ff6f61, #de4313);
    color: white;
    padding: 12px 30px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .restart-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  .restart-btn:active {
    transform: translateY(1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
</style>
