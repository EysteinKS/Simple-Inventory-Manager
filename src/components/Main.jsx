import React, { useState } from "react";
import "./Main.css";

import Products from "./inventory/Products";
import Orders from "./inventory/Orders";
import History from "./inventory/History";
import Sales from "./sales/Sales";

export default () => {
  const views = ["status", "products", "orders", "history"];
  const [view, setView] = useState(views[1]);

  let current = null;
  switch (view) {
    case "products":
      current = <Products />;
      break;
    case "orders":
      current = <Orders />;
      break;
    case "history":
      current = <History />;
      break;
    case "customers":
      current = <div/>
      break;
    default:
      break;
  }

  return (
    <div className="Inventory">
      <Header view={view} setView={setView} />
      <div className="Inventory-current">{current}</div>
    </div>
  );
};

const Header = ({ view, setView }) => {
  const pages = [
    ["Produkter", "products"],
    ["Bestillinger", "orders"],
    ["Salg", "sales"],
    ["Logg", "history"]
  ];
  return (
    <header className="Inventory-header">
      <h3>Lager</h3>
      {pages.map((btn, i) => {
        let name = btn[0];
        let value = btn[1];
        return (
          <HeaderButton
            name={name}
            value={value}
            view={view}
            setView={setView}
            key={i}
          />
        );
      })}
    </header>
  );
};

const HeaderButton = ({ name, value, view, setView }) => {
  let style = "btn-inactive";
  if (view === value) {
    style = "btn-active";
  }
  return (
    <button className={style} onClick={() => setView(value)}>
      {name}
    </button>
  );
};