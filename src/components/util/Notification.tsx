import React, { useMemo, useEffect, useState } from "react";
import styled from "styled-components";
import { InputButton } from "../../styles/form";
import Icons from "./Icons";
import { INotification, RootState } from "../../redux/types";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "../../redux/actions/notificationActions";
import CountdownBar from "./CountdownBar";

interface NotificationProps {
  notification: INotification;
  close: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, close }) => {
  const [timeoutId, setTimeoutId] = useState(null as number | null);

  const color = React.useMemo(() => {
    switch (notification.type) {
      case "warning":
        return "hsl(0, 92%, 70%)";
      case "info":
        return "#ffe000";
      case "success":
      default:
        return "hsl(89, 55%, 55%)";
    }
  }, [notification.type]);

  useEffect(() => {
    if (notification.timeout) {
      const time = notification.timeout * 1000;

      const timeout = window.setTimeout(() => {
        close();
      }, time);

      setTimeoutId(timeout);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
    /* eslint-disable-next-line */
  }, []);

  const onClose = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    close();
  };

  return (
    <NotificationWrapper color={color}>
      <NotificationText>{notification.message}</NotificationText>
      <CountdownBar color={color} time={notification.timeout || 0} />
      <InputButton onClick={onClose}>
        <Icons.Close />
      </InputButton>
    </NotificationWrapper>
  );
};

export const NotificationHandler = () => {
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const dispatch = useDispatch();

  const close = (i: number) => dispatch(removeNotification(i));

  const maxLengthNotifArray = useMemo(() => {
    if (notifications.length < 7) {
      return notifications;
    } else {
      return notifications.slice(0, 6);
    }
  }, [notifications]);

  if (notifications.length < 1) return null;

  return (
    <HandlerWrapper>
      {maxLengthNotifArray.map(n => (
        <Notification
          key={"notification_" + n.id}
          notification={n}
          close={() => close(n.id)}
        />
      ))}
    </HandlerWrapper>
  );
};

const HandlerWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 7vh;
  width: 230px;
  display: grid;
  row-gap: 10px;
`;

interface NotificationWrapperProps {
  color: string;
}

const NotificationWrapper = styled.div<NotificationWrapperProps>`
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-template-rows: auto 5px;
  border-radius: 0.3em;
  font-size: 14px;
  grid-template-areas:
    "txt btn"
    "countdown btn";

  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
  background: white;

  p {
    grid-area: txt;
  }

  div {
    grid-area: countdown;
  }

  button {
    border-radius: 0 0.3em 0.3em 0;
    grid-area: btn;
    background: ${props => props.color};
  }

  animation: fadein 0.5s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const NotificationText = styled.p`
  padding: 1em;
  margin: 0;
`;

export default Notification;
