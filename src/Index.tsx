import * as React from "react";
import Fuzzy from "fuzzysearch";
import { render } from "react-dom";
import { TGame } from "../types/TGame";
import { fetchGames } from "./Apiz";
import { Card, Icon, Avatar, Row, Col, List, Select, Slider, Checkbox, Input, Layout } from "antd";
import { Data } from "./data/Data";
import { GameItem } from "./components/GameItem";
import { TFilter } from "../types/TFilter";
import { Filters } from "./components/Filters";
const { Meta } = Card;

const OPENRA_CURRENT_VERSION = 20180307;

type State = {
  games: TGame[];
  filteredGames: TGame[];
  filters: TFilter;
};

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      games: [],
      filteredGames: [],
      filters: {
        locked: true,
        games: ["ra", "cnc", "d2k"],
        players: [0, 8],
        search: "",
        showPlaying: true,
        showWaiting: true,
        version: "release-20180307"
      }
    };
  }

  filterGames(games: TGame[], filters: TFilter) {
    const filtered = games
      .filter(g => g.version === filters.version)
      .filter(g => filters.games.includes(g.mod))
      .filter(g => g.players > filters.players[0] && g.players < filters.players[1])
      .filter(g => (filters.locked ? true : g.protected === false))
      .filter(g => (filters.showPlaying ? true : g.state === 2))
      .filter(g => (filters.showWaiting ? true : g.state === 1));
    return filters.search.length < 3 ? filtered : filtered.filter(g => Fuzzy(filters.search, g.name));
  }

  async componentDidMount() {
    const games = await fetchGames();
    const filteredGames = this.filterGames(games, this.state.filters);
    this.setState({
      games,
      filteredGames
    });
  }

  onFilterChange = <F extends keyof TFilter>(filter: F, newValue: TFilter[F]) => {
    console.log("filter has been changed");
    const filters = {
      ...this.state.filters,
      [filter]: newValue
    };
    const filteredGames = this.filterGames(this.state.games, filters);
    this.setState({
      filters,
      filteredGames
    });
  };

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <Filters {...this.state.filters} onFilterChange={this.onFilterChange} />
        {this.state.filteredGames.filter(game => game.version === this.state.filters.version).map((game, index) => (
          <span key={index}>
            <GameItem game={game} />
            <hr />
          </span>
        ))}
      </div>
    );
  }
}

render(<App />, document.getElementById("app") as HTMLDivElement);
