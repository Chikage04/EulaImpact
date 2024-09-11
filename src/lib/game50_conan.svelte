<script>
  import { onMount } from "svelte";
  import charactersData from './conan.json';

  let score = 0;
  let questionCount = 0;
  let currentPair = [];
  let currentName = '';
  let gameOver = false;
  let scoreMax = 30;
  let usedNames = [];

  console.log(charactersData);
  
  // Récupère les personnages du fichier JSON
  const characters = charactersData || [];
  console.log(characters);
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
  } while (
    usedPairs.has(generatePairKey(pair[0], pair[1])) || 
    usedNames.includes(pair[0].name) || 
    usedNames.includes(pair[1].name) &&
    attempts < 100
  );

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

  // Fonction pour obtenir un nom aléatoire parmi les deux personnages
  function getRandomName(pair) {
    if (!pair[0] || !pair[1]) {
      return ''; // Retourne une chaîne vide si la paire est invalide
    }
    return pair[Math.floor(Math.random() * pair.length)].name;
  }

  // Initialiser la première paire de personnages et le nom
  onMount(() => {
    currentPair = getUniqueRandomPair();
    currentName = getRandomName(currentPair);
  });

  // Fonction appelée lorsqu'une image est cliquée
  function handleChoice(selectedCharacter) {
  if (currentPair.length < 2 || !currentPair[0] || !currentPair[1]) {
    console.error("currentPair ne contient pas assez de personnages valides.");
    return;
  }

  if (selectedCharacter.name === currentName) {
    score++;
  }

  usedNames.push(currentName);  // Ajoutez cette ligne

  questionCount++;
  if (questionCount >= scoreMax) {
    gameOver = true;
  } else {
    currentPair = getUniqueRandomPair();
    currentName = getRandomName(currentPair);
  }
}


  // Redémarrer le quiz
  function restartQuiz() {
  score = 0;
  questionCount = 0;
  gameOver = false;
  usedPairs.clear(); // Réinitialiser les paires utilisées
  usedNames = [];  // Réinitialiser les noms utilisés
  currentPair = getUniqueRandomPair();
  currentName = getRandomName(currentPair);
}

</script>

<main>
  <h1>Quel personnage correspond à ce nom ?</h1>
  {#if !gameOver}
    <p class="score">Score: {score} / {scoreMax}</p>
    {#if currentPair[0] && currentPair[1]}
      <div class="question">
        <p>Qui est {currentName} ?</p>
        <div class="images">
          <button on:click={() => handleChoice(currentPair[0])}>
            <img src={currentPair[0].image_url} alt={currentPair[0].name} />
          </button>
          <button on:click={() => handleChoice(currentPair[1])}>
            <img src={currentPair[1].image_url} alt={currentPair[1].name} />
          </button>
        </div>
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
  .images {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap; /* Permet aux images de se réorganiser sur les petits écrans */
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 10px; /* Ajout d'un espace autour des images */
  }

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
    width: 100%; /* Assurez-vous que le conteneur prend la largeur totale disponible */
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.7);
    box-sizing: border-box; /* Inclut padding et border dans la largeur totale */
    
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #1e3a8a;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1rem;
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
    font-size: 1rem;
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
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 25px;
  }

  .game-over {
    font-size: 1.5rem;
    color: #e53e3e;
    margin-bottom: 20px;
  }

  .restart-btn {
    background: linear-gradient(135deg, #ff6f61, #de4313);
    color: white;
    padding: 12px 30px;
    font-size: 1rem;
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

  /* Media Queries pour les petits écrans */
  @media (max-width: 600px) {
    main {
      padding: 20px;
      max-width: 90%;
    }

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.9rem;
    }

    button {
      padding: 10px 20px;
      font-size: 0.9rem;
    }

    .score {
      font-size: 1rem;
    }

    .game-over {
      font-size: 1.3rem;
    }

    .restart-btn {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
  }
</style>
