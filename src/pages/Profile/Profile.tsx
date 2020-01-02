import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import styled from "styled-components";
import ChangePassword from "../../components/profile/ChangePassword";
import { toggleTooltips } from "../../redux/actions/authActions";

export default function Profile() {
  const isDemo = useSelector((state: RootState) => state.auth.isDemo);

  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <h1 style={{ textAlign: "center" }}>PROFIL</h1>
      <UserData />
      {!isDemo && <ChangePassword />}
    </div>
  );
}

const UserData = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isDemo = useSelector((state: RootState) => state.auth.isDemo);
  const dispatch = useDispatch();

  return (
    <StyledUserData>
      <DataKey>Fornavn</DataKey>
      <p>{user.firstName}</p>
      <DataKey>Etternavn</DataKey>
      <p>{user.lastName}</p>
      {!isDemo && (
        <>
          <DataKey>Vis hint</DataKey>
          <input
            type="checkbox"
            checked={user.settings.showTooltips}
            onChange={() => dispatch(toggleTooltips())}
            style={{
              alignSelf: "center"
            }}
          />
        </>
      )}
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
