import React, { useContext, useEffect, useState } from "react";
import { Modal } from "../Components/Modal";
import { tournamentService } from "../assets/api/TournamentService";
import { useTorneoContext } from "../contexts/TorneoContext";
import { TrainersRegisterModal } from "../Components/TrainersRegisterModal";
import { TrainerContext } from "../contexts/TrainerProvider";
import axios from "axios";

export const TournamentsList = () => {

  const [tournamentsList, setTournamentsList] = useState([]);
  const { setTournamentSelected } = useTorneoContext();
  const [isInfoModalOpen, setIsInfoModalOpen] =
    useState(false);

  const openInfoModal = (tournamentSelected1) => {
    setTournamentSelected(tournamentSelected1);
    localStorage.setItem("tournamentSelected", JSON.stringify(tournamentSelected1));
    setIsInfoModalOpen(true);
  }
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const [trainerRegisterModalIsOpen, setTrainerRegisterModalIsOpen] = useState(false);

  const { trainer } = useContext(TrainerContext);


  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    const tournaments = await tournamentService.getTournaments();
    setTournamentsList(tournaments);
  }

  const [alertMessage, setAlertMessage] = useState("");
  const [alertError, setAlertError] = useState("");

  const handleClickRegister = async (tournamentId) => {
    try {
    const trainerID = JSON.parse(localStorage.getItem("trainer"));
    const response = await axios.post(
      `https://tournaments-cwe7cmcagfhzd5dc.eastus2-01.azurewebsites.net/api/tournament/register/${tournamentId}`, 
      { trainerId: trainerID.id }, 
      { headers: { "Content-Type": "application/json" } });
    if (response.status === 200) {
        setTrainerRegisterModalIsOpen(false);
        console.log("Registering to tournament with id", tournamentId);
        setAlertMessage("You have been registered to the tournament");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    } catch (error) {
      setTrainerRegisterModalIsOpen(false);
      console.log(error)
      setAlertError(error.response.data.message);
      setTimeout(() => {
        setAlertError("");
      }, 3000);
      console.error("Error registering to tournament", error.response.data.message);
    }
  };



  return (
    <div className="container" style={{ marginTop: "30px", width: "50%" }}>
      <div>
        {alertMessage && (
          <div
            className="alert alert-success"
            role="alert"
          >
            {alertMessage}
          </div>
        )}
      </div>
      <div>
        {alertError && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {alertError}
          </div>
        )}
      </div>
      {tournamentsList.map((tournament) => (
        <div key={tournament.id}>
          <div className="list-group">
            <a
              href="#"
              className="list-group-item list-group-item-action active"
              aria-current="true"
              style={{ backgroundColor: "purple", borderColor: "purple", opacity: "0.7" }}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{tournament.name}</h5>
                <small></small>
              </div>
              <p className="mb-1">Cantidad de participantes: {tournament.minParticipantQuantity}</p>
              <small>{tournament.description}</small>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  type="button"
                  className="btn btn-info"
                  style={{ marginRight: "10px", backgroundColor: "#ee80b7", borderColor: "#ee80b7" }}
                  onClick={() => openInfoModal(tournament)}
                >
                  Info
                </button>
                <button
                  type="button"
                  className={
                    tournament.tournamentState === "En Registro"
                      ? "btn btn-success"
                      : tournament.tournamentState === "En Progreso"
                        ? "btn btn-warning"
                        : "btn btn-danger"
                  }
                  style={{ marginRight: "10px" }}
                >
                  Estado: {tournament.tournamentState}
                </button>
                {tournament.tournamentState === "En Registro" ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setTrainerRegisterModalIsOpen(true)}
                    style={{ color: "white" }}
                  >
                    Registrarme
                  </button>
                ) : null}
              </div>

            </a>

          </div>
          <Modal
            isOpen={isInfoModalOpen}
            onClose={closeInfoModal}
          />

          <br />
          <TrainersRegisterModal isOpen={trainerRegisterModalIsOpen} onClose={() => setTrainerRegisterModalIsOpen(false)}
            onConfirm={() => handleClickRegister(tournament.id)}></TrainersRegisterModal>
        </div>

      ))}


    </div>
  );
};
