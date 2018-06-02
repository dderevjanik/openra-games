import * as React from "react";
import Fuzzy from "fuzzysearch";
import { render } from "react-dom";
import { TGame } from "./types/TGame";
import { Map } from "./components/Map";
import { fetchGames, fetchOpenRAVersions } from "./Apiz";
// import {  Table, Tooltip, Pagination } from "antd";

import Layout from "antd/lib/layout";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

import { TFilter } from "./types/TFilter";
import { Filters } from "./components/Filters";
import { TMap } from "./types/TMap";
import "./styles/main.less";
import { ClientsInfo } from "./components/ClientsInfo";
import { ClientLabel } from "./components/ClientLabel";
import { EGameState } from "./types/EGameState";
import { GamesCounter } from "./components/GamesCounter";
import { JoinButton } from "./components/JoinButton";
import { GameInfo } from "./components/GameInfo";
import { alphabeticalSorter } from "./utils/Sorters";
import { isJoinable } from "./utils/Predicates";
import { defaultFilters } from "./data/DefaultFilters";
import { storage } from "./modules/LocalStorage";

type State = {
  games: TGame[];
  maps: TMap[];
  isLoading: boolean;
  filterHasChanged: boolean;
  pagination: {
    current: number;
    total: number;
  };
  filteredGames: TGame[];
  versions: string[];
  filters: TFilter;
  expandedRows: number[];
};

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const filters = storage.get("version") === "0.0.1" ? storage.get("filter") : defaultFilters;
    const filterHasChanged = storage.get("filterHasChanged")!;
    this.state = {
      games: [],
      maps: [],
      filteredGames: [],
      versions: [],
      isLoading: true,
      pagination: {
        current: 1,
        total: 1
      },
      filterHasChanged,
      expandedRows: [],
      filters
    };
  }

  setDefaultFilters = () => {
    const filtered = this.filterGames(this.state.games, defaultFilters);
    storage.reset();
    this.setState({
      filters: defaultFilters,
      filteredGames: filtered.filteredGames,
      filterHasChanged: false
    });
  };

  filterGames(games: TGame[], filters: TFilter) {
    const searchWord = filters.search.toLowerCase();
    const versioned = filters.version === "-- ALL --" ? games : games.filter(g => g.version === filters.version);
    const basicFiltered = versioned
      .filter(g => filters.games.includes(g.mod))
      .filter(g => g.players >= filters.players[0] && g.players <= filters.players[1])
      .filter(g => (filters.showProtected ? true : g.protected === false));

    let filtered: TGame[] = basicFiltered;
    if (!filters.showEmpty && !filters.showWaiting && !filters.showPlaying) {
      // Show nothing means show *everything*, so use only basic filtering
    } else {
      if (!filters.showEmpty && !filters.showWaiting) {
        // Don't show Empty and Waiting games
        // -> get all PLAYING games
        filtered = basicFiltered.filter(g => g.state === EGameState.PLAYING);
      } else if (!filters.showEmpty) {
        // Show Waiting Games
        // -> Get games with at least 1 client
        filtered = basicFiltered.filter(g => g.clients.length > 0);
      } else if (!filters.showWaiting) {
        // Show Empty Games
        // -> Get games with NO clients OR those who are Playing
        filtered = basicFiltered.filter(
          g => (g.clients.length === 0 && g.state === EGameState.NOTPLAYING) || g.state === EGameState.PLAYING
        );
      }
      filtered = filtered.filter(g => (filters.showPlaying ? true : g.state === EGameState.NOTPLAYING));
    }

    // TODO: Throttle search function
    const found = filters.search.length < 3 ? filtered : filtered.filter(g => Fuzzy(searchWord, g.name.toLowerCase()));
    const pages = Math.ceil(parseInt((found.length / 10).toFixed(1)));
    return {
      pagination: {
        current: 1, // TODO: last page
        total: pages
      },
      filteredGames: found
    };
  }

  async componentDidMount() {
    const [games, versions] = await Promise.all([fetchGames(), fetchOpenRAVersions()]);
    const updatedFilter = {
      ...this.state.filters,
      version: versions.release
    };
    const filteredGames = this.filterGames(games, updatedFilter);
    this.setState({
      isLoading: false,
      games,
      ...filteredGames,
      versions: versions.known_versions,
      filters: updatedFilter
    });
  }

  updateGames = async () => {
    // Make sure that there is no update in progress
    if (!this.state.isLoading) {
      this.setState(
        {
          isLoading: true
        },
        // After setting loading state, we can start fetching games list
        async () => {
          const games = await fetchGames();
          // Filter list after a fetch
          const filteredGames = this.filterGames(games, this.state.filters);
          this.setState({
            isLoading: false,
            games,
            ...filteredGames
          });
        }
      );
    }
  };

  onFilterChange = <F extends keyof TFilter>(filterName: F, newValue: TFilter[F]) => {
    const filters = {
      ...this.state.filters,
      [filterName]: newValue // Update specific filter
    };
    storage.set("filter", filters);
    storage.set("filterHasChanged", true);
    const filteredGames = this.filterGames(this.state.games, filters);
    this.setState({
      filters,
      ...filteredGames,
      filterHasChanged: true
    });
  };

  toggleExpandedRow = (key: number) => {
    const isExpanded = this.state.expandedRows.includes(key);
    if (isExpanded) {
      // TODO: Optimize
      const expandedRows = this.state.expandedRows.filter(k => k !== key);
      this.setState({
        expandedRows
      });
    } else {
      this.setState({
        expandedRows: [...this.state.expandedRows, key]
      });
    }
  };

  render() {
    const { state } = this;
    return (
      <Layout>
        <Filters
          {...state.filters}
          onFilterChange={this.onFilterChange}
          versions={state.versions}
          onRefresh={this.updateGames}
          isLoading={state.isLoading}
          filterHasChanged={state.filterHasChanged}
          onResetFilters={this.setDefaultFilters}
        />
        <Table
          rowKey="id"
          dataSource={this.state.filteredGames}
          size={"small"}
          expandedRowKeys={this.state.expandedRows}
          onExpandedRowsChange={keys => this.setState({ expandedRows: keys as number[] })}
          expandedRowRender={(record: TGame) => (
            <Row>
              <Col span={8}>
                <Map id={record.id.toString()} hash={record.map} clients={record.clients} />
              </Col>
              <Col span={16}>
                <ClientsInfo
                  mod={record.mod}
                  clients={record.clients}
                  orientation={"horizontal"}
                  showSpawnpoints={true}
                />
              </Col>
            </Row>
          )}
          pagination={false}
          className={"games"}
        >
          <Table.Column
            key="mod"
            title="Mod"
            dataIndex="mod"
            width={50}
            render={(_, record: TGame) => (
              <Tooltip
                getPopupContainer={target => target as HTMLElement}
                title={
                  <GameInfo
                    allVersions={state.versions}
                    address={record.address}
                    gameVersion={record.version}
                    location={record.location}
                  />
                }
              >
                <div>
                  <img src={`icons/${record.mod}.png`} height={24} />
                </div>
              </Tooltip>
            )}
          />
          <Table.Column
            key="name"
            title="Name"
            sorter={alphabeticalSorter}
            render={(_, record: TGame) => (
              <div className="click-to-expand-row" onClick={() => this.toggleExpandedRow(record.id)}>
                <div>
                  {record.protected ? (
                    <Tooltip title={"Game is password protected"} getPopupContainer={target => target as HTMLElement}>
                      <i className="fa fa-lock" />
                    </Tooltip>
                  ) : null}{" "}
                  <span
                    style={{
                      color: record.state === 2 ? "green" : record.players > 0 ? "orange" : ""
                    }}
                  >
                    {record.name}
                  </span>
                </div>
                {/* <MapName mapHash={record.map} /> */}
              </div>
            )}
          />
          <Table.Column
            key="players"
            title={<i className="fa fa-users" />}
            width={90}
            sorter={(a: TGame, b: TGame) => a.players - b.players}
            defaultSortOrder={"descend"}
            render={(_, record: TGame) => (
              <div>
                {record.players} / {record.maxplayers}
              </div>
            )}
          />
          <Table.Column key="clients" width={100} render={(_, record: TGame) => <ClientLabel game={record} />} />
          <Table.Column
            key="addons"
            width={100}
            render={(_, record: TGame) => (
              <div style={{ textAlign: "right" }}>
                {// Don't show Join button on running games, neither on full servers
                isJoinable(record) ? (
                  <JoinButton address={record.address} version={record.version} />
                ) : record.state === 2 ? (
                  <small style={{ color: "grey" }}>
                    {record.playtime ? (
                      <span>{(record.playtime / 60).toFixed(0)}m</span>
                    ) : (
                      <span>
                        ? <i className="fa fa-clock" />
                      </span>
                    )}
                  </small>
                ) : null}
              </div>
            )}
          />
        </Table>
        {state.filteredGames.length > 0 ? (
          <GamesCounter current={state.filteredGames.length} total={state.games.length} />
        ) : null}
      </Layout>
    );
  }
}

render(<App />, document.getElementById("app") as HTMLDivElement);
