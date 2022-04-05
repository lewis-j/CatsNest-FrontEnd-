// App.tsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { Cat } from "./cats//cat.interface";
import CatsTable from "./cats/cats.table";
import axios from "axios";
import { Button } from "reactstrap";
import Jumbotron from "./components/jumbotron";
import { createImportSpecifier } from "typescript";

const App = () => {
  // Data
  const catsData: Cat[] = [];
  const userData: User = {};

  interface User {
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    userinfo?: UserInfo;
  }

  interface UserInfo {
    name?: string;
  }

  // Setting state
  const [cats, setCats] = useState(catsData);
  const [user, setUser] = useState(userData);

  const getCats = async () => {
    try {
      const response = await fetch("/cats");
      const cats = await response.json();
      setCats(cats);
    } catch {
      // add better error handling here (e.g. 401?)
    }
  };

  useEffect(() => {
    // Create a scoped async function in the hook
    async function runAsync() {
      try {
        const response = await fetch("/user");
        const userResponse = await response.text();
        console.log("User RESPONSE:", userResponse);
        setUser(JSON.parse(userResponse));
        if (userResponse !== "") {
          getCats();
        }
      } catch (error) {
        // add better error handling here
        console.log("error", error);
      }
    }
    // Execute the created function directly
    runAsync();
    // https://stackoverflow.com/a/55854902/1098564
    // eslint-disable-next-line
  }, []);

  const addData = async () => {
    await axios.post("./cats", {
      name: "russel",
      age: 5,
      breed: "longhair",
    });
  };

  const login = () => {
    window.location.replace("/login");
  };
  const logout = () => {
    window.location.replace("/logout");
  };
  // https://stackoverflow.com/a/32108184/1098564
  const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  return (
    <div>
      <Jumbotron>
        <h1 className="display-3">
          Cat's Nest!{" "}
          <span role="img" aria-label="smiling cat">
            😺
          </span>
        </h1>
        {user && user.userinfo && (
          <p className="lead">Hey {user.userinfo.name}</p>
        )}
        <p className="lead">
          {isEmpty(user) ? (
            <Button color="primary" onClick={login}>
              Login
            </Button>
          ) : (
            <div>
              <Button color="danger" onClick={logout}>
                logout
              </Button>
              <Button color="danger" onClick={addData}>
                add data
              </Button>
            </div>
          )}
        </p>
      </Jumbotron>
      {!isEmpty(user) && <CatsTable cats={cats} />}
    </div>
  );
};

export default App;
