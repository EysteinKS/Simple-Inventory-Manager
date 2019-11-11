import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import styled from "styled-components";
import ChangeLocation from "../../components/profile/ChangeLocation"
import ChangePassword from "../../components/profile/ChangePassword"

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [edit, setEdit] = useState(false);

  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <h1 style={{ textAlign: "center" }}>PROFIL</h1>
      <StyledEditButton onClick={() => setEdit(!edit)}>
        {edit ? "Lagre" : "Endre"}
      </StyledEditButton>
      <UserData edit={edit} />
      <ChangePassword/>
      {user.locations.length > 1 && <ChangeLocation />}
    </div>
  );
}

const StyledEditButton = styled.button`
  width: 20%;
  height: 3em;
  justify-self: center;
  background-color: #fff;
  margin-bottom: 2em;
`;

const UserData = ({ edit }: { edit: boolean }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [lang, setLang] = useState(user.settings.language);
  const [showHidden, setShowHidden] = useState(user.settings.isInactiveVisible);

  if (edit)
    return (
      <StyledUserDataForm>
        <DataKey>Fornavn</DataKey>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <DataKey>Etternavn</DataKey>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <DataKey>Språk</DataKey>
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="NO">NO</option>
        </select>
        <DataKey>Vis skjulte produkter?</DataKey>
        <input
          type="checkbox"
          checked={showHidden}
          onChange={() => setShowHidden(!showHidden)}
        />
      </StyledUserDataForm>
    );

  return (
    <StyledUserData>
      <DataKey>Fornavn</DataKey>
      <p>{firstName}</p>
      <DataKey>Etternavn</DataKey>
      <p>{lastName}</p>
      <DataKey>Språk</DataKey>
      <p>{lang}</p>
      <DataKey>Vis skjulte produkter?</DataKey>
      <input type="checkbox" checked={showHidden} disabled />
    </StyledUserData>
  );
};

const DataKey = styled.p`
  text-align: end;
  font-size: 0.9em;
  color: #444;
`;

const StyledUserData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2em;
`;

const StyledUserDataForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2em;
`;