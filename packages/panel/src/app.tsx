import { useState, useEffect } from "react";

import Login from "./components/Login";
import Configure from "./components/Configure";
import { UserProvider, useUser } from "./components/UserProvider";
import Person, { PersonData } from "./components/Person";
import Link from "./components/Link";
import CurrentProject from "./components/CurrentProject";
import { Logomark } from "./components/Icons";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export function App() {
  const { user } = useUser();

  const [screen, setScreen] = useState<"login" | "configure" | "main">(
    user?.personProps ? "main" : user ? "configure" : "login"
  );
  const [panelOpen, setPanelOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [persons, setPersons] = useState<PersonData[]>([]);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);

    if (url.has("email") && user) {
      setQuery(url.get("email") as string);

      setLoading(true);

      fetch(
        `${user.url}/api/projects/@current/persons?search=${url.get("email")}`,
        { headers: { Authorization: `Bearer ${user.apiKey}` } }
      )
        .then((res) => res.json())
        .then((data) => setPersons(data.results))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `${user.url}/api/projects/@current/persons?search=${query}`,
      { headers: { Authorization: `Bearer ${user.apiKey}` } }
    );

    const data = await res.json();

    setPersons(data.results);

    setLoading(false);
  };

  return (
    <>
      <UserProvider>
        {screen === "login" ? (
          <Login next={() => setScreen("configure")} />
        ) : screen === "configure" ? (
          <Configure next={() => setScreen("main")} />
        ) : (
          <div
            className={`w-full h-full flex flex-col border-l shadow-md transform transition-transform bg-light-gray ${
              panelOpen ? "" : "translate-x-full"
            }`}
          >
            <div className="px-2 py-2 border-b">
              <div className="flex justify-between items-center space-x-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 flex items-center">
                    <Logomark />
                  </span>
                  <span className="font-semibold opacity-75 text-sm">
                    <CurrentProject />
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="https://app.posthog.com"
                    external
                    classes="text-xs text-black bg-accent/5 hover:bg-accent/10 active:bg-accent/20 p-1.5 rounded-full leading-none group"
                  >
                    Open in PostHog{" "}
                    <span className="opacity-50 group-hover:opacity-75">→</span>
                  </Link>
                  <button onClick={() => setScreen("configure")}>
                    <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="flex-grow border border-solid border-accent rounded-sm px-2 py-1 text-sm"
                    placeholder="Search users in PostHog..."
                    value={query}
                    onInput={(event) =>
                      setQuery((event.target as HTMLInputElement).value)
                    }
                  />
                  <button type="submit" className="hidden">
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {loading ? (
              <ul className="divide-y">
                {new Array(8).fill(1).map(() => {
                  return (
                    <li className="py-3 px-3">
                      <div className="w-full rounded py-3 bg-gray-200 animate-pulse" />
                    </li>
                  );
                })}
              </ul>
            ) : persons.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                No results
              </div>
            ) : persons.length === 1 ? (
              <Person person={persons[0]} />
            ) : (
              <ul className="divide-y overflow-y-scroll flex-grow overscroll-y-contain pb-2">
                {persons.map((person) => {
                  return (
                    <li>
                      <Person person={person} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </UserProvider>
    </>
  );
}
