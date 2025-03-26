import { useEffect, useState } from "react";
import TournamentRegistrationService from "../assets/api/TournamentRegistrationService";
import { useTorneoContext } from "../contexts/TorneoContext";
import pokemonChampion from "../assets/pokemon_championships.png" ; 

export default function TournamentBracket() {

  const [trainers, setTrainers] = useState([]);
  const [brackets, setBrackets] = useState([]);
  const [phase, setPhase] = useState(null);
  const { tournamentSelected } = useTorneoContext();

  const grupos = [
    { origen: [1, 2], destino: 9 },
    { origen: [3, 4], destino: 10 },
    { origen: [5, 6], destino: 11 },
    { origen: [7, 8], destino: 12 },
    { origen: [22, 23], destino: 18 },
    { origen: [24, 25], destino: 19 },
    { origen: [26, 27], destino: 20 },
    { origen: [28, 29], destino: 21 },
    { origen: [9, 10], destino: 13 },
    { origen: [11, 12], destino: 14 },
    { origen: [18, 19], destino: 16 },
    { origen: [20, 21], destino: 17 },
    { origen: [13, 14], destino: 30 },
    { origen: [16, 17], destino: 31 },
    { origen: [30, 31], destino: 15 },

  ];

  const [indiceGrupo, setIndiceGrupo] = useState(0);

  useEffect(() => {
    loadTrainers();
    loadBrackets();
    loadPhase2();
  }, [tournamentSelected, phase]);


  const loadTrainers = async () => {
    const entrenadores = await TournamentRegistrationService.getParticipantsByTournamentId(tournamentSelected.id);
    setTrainers(entrenadores);
  }

  const loadBrackets = async () => {
    const brackets = await TournamentRegistrationService.getBracketsByTournamentId(tournamentSelected.id);
    setBrackets(brackets);
  }

  const loadPhase = async () => {
    const phase = await TournamentRegistrationService.getPhaseByTournamentId(tournamentSelected.id);
    setPhase(phase);
  }
  const loadPhase2 = async () => {
    if(!phase){
      loadPhase();
    }
    setTimeout(() => {
      loadPhase();
    }, 3000);
  }


  const nextPosition = (event) => {
    if (indiceGrupo >= grupos.length) return;

    const { origen, destino } = grupos[indiceGrupo];
    const elemDestino = document.getElementById(destino);

    if (elemDestino) {
      const nuevoDiv = document.createElement("div");
      nuevoDiv.className = "bracket-name";

      const na = Math.random() * 2;
      const g = na > 1 ? 0 : 1
      const elemOrigen = document.getElementById(origen[g])?.firstElementChild;
      let contenido = "";
      if (elemOrigen) {
        document.getElementById(origen[g]).classList.add("winner")
        contenido += elemOrigen.textContent + " ";
      }

      nuevoDiv.textContent = contenido.trim();
      nuevoDiv.classList.add("nm");
      elemDestino.appendChild(nuevoDiv);

      setTimeout(() => {
        nuevoDiv.classList.add("pop");
      }, 100);

    }
    setIndiceGrupo(prev => prev + 1);
  }

  const getTrainerName = (bracketIndex, participantType) => {
    const bracket = brackets[bracketIndex];
    if (!bracket) return '';
    const trainer = trainers.find(trainer => trainer.id === bracket[participantType]);
    return trainer ? trainer.name : '';
  }

  const getTrainerNameEvolvep = (phaseIndex, bracketIndex, participantType) => {
    if (!phase) return '';
    if (phase.consecutiveNumberWithinTournament > phaseIndex) {
        return getTrainerName(bracketIndex, participantType);
    }

    const baseOffset = 8;
    const offsetDifference = bracketIndex - baseOffset;  
    const firstParticipantOffset = baseOffset - offsetDifference;
    const secondParticipantOffset = firstParticipantOffset - 1;

    const offsetMap = [1, 2, 3].reduce((map, phaseIndex) => {
        map[phaseIndex] = { firstParticipant: firstParticipantOffset, secondParticipant: secondParticipantOffset };
        return map;
    }, {});

    if (offsetMap[phaseIndex]) {
        const offset = offsetMap[phaseIndex][participantType];
        return getTrainerName(bracketIndex - offset, 'winner');
    }

    return '';
  }

  return (
    <div id="tournament">
      <div className="header">
        <h1>Llaves de torneo Pokemon</h1>
      </div>
      {/* <img src="src\assets\pokemon_championships.png" alt="Torneo pokemon" width={100}/> */}
      <div className="bracket-container">
        {/* Nivel 1 */}
        <div className="bracket-level">
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="1" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 0,'firstParticipant')}</div>
            </div>
            <div id="2" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 0,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="3" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 1,'firstParticipant')}</div>
            </div>
            <div id="4" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 1,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="5" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 2,'firstParticipant')}</div>
            </div>
            <div id="6" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 2,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="7" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 3,'firstParticipant')}</div>
            </div>
            <div id="8" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 3,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
        </div>
        {/* Nivel 2 */}
        <div className="bracket-level">
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="9" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 8,'firstParticipant')}</div>
            </div>
            <div id="10" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 8,'secondParticipant')}</div>
              
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="11" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 9,'firstParticipant')}</div>
            </div>
            <div id="12" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 9,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
        </div>
        {/* Nivel 3 */}
        <div className="bracket-level">
          <div className="bracket-matchup">
            <div id="13" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(2, 12,'firstParticipant')}</div>
            </div>
            <div id="14" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(2, 12,'secondParticipant')}</div>
            </div>
          </div>
        </div>
        {/* Nivel 4 */}
        <div className="bracket-level">
          <div>
            <img src={pokemonChampion} alt="Torneo pokemon" width={150} />
          </div>
          <div className="bracket-matchup">
            <div id="30" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(3, 14,'firstParticipant')}</div>
            </div>
            <div id="31" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(3, 14,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup">
            <div id="15" className="winner-team winner">
              <div className="bracket-name">{getTrainerNameEvolvep(3, 14,'winner')}</div>
            </div>
          </div>
        </div>
        {/* Nivel 5 */}
        <div className="bracket-level">
          <div className="bracket-matchup">
            <div id="16" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(2, 13,'firstParticipant')}</div>
            </div>
            <div id="17" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(2, 13,'secondParticipant')}</div>
            </div>
          </div>
        </div>
        {/* Nivel 6 */}
        <div className="bracket-level">
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="18" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 10,'firstParticipant')}</div>
            </div>
            <div id="19" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 10,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="20" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 11,'firstParticipant')}</div>
            </div>
            <div id="21" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(1, 11,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup" />
        </div>
        {/* Nivel 7 */}
        <div className="bracket-level">
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="22" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 4,'firstParticipant')}</div>
            </div>
            <div id="23" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 4,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="24" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 5,'firstParticipant')}</div>
            </div>
            <div id="25" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 5,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="26" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 6,'firstParticipant')}</div>
            </div>
            <div id="27" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 6,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
          <div className="bracket-matchup">
            <div id="28" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 7,'firstParticipant')}</div>
            </div>
            <div id="29" className="bracket-team">
              <div className="bracket-name">{getTrainerNameEvolvep(0, 7,'secondParticipant')}</div>
            </div>
          </div>
          <div className="bracket-matchup" />
        </div>
      </div>
    </div>
  );
}
