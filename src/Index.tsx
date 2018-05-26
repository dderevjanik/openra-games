import * as React from "react";
import Fuzzy from "fuzzysearch";
import { render } from "react-dom";
import { TGame } from "./types/TGame";
import chunk from "lodash.chunk";
import { Map } from "./components/Map";
import { fetchGames, fetchOpenRAVersions, fetchMaps, fetchMap } from "./Apiz";
// import {  Table, Tooltip, Pagination } from "antd";

import Layout from "antd/lib/layout";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import Pagination from "antd/lib/pagination";
import Tag from "antd/lib/tag";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";

import { Data } from "./data/Data";
import { TFilter } from "./types/TFilter";
import { Filters } from "./components/Filters";
import { TMap } from "./types/TMap";
import { version } from "moment";
import "./styles/main.less";
import { ClientsInfo } from "./components/ClientsInfo";
import { ClientLabel } from "./components/ClientLabel";
import { EGameState } from "./types/EGameState";

type State = {
  games: TGame[];
  maps: TMap[];
  isLoading: boolean;
  pagination: {
    current: number;
    total: number;
  };
  filteredGames: TGame[];
  versions: string[];
  filters: TFilter;
};

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
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
      filters: {
        showEmpty: true,
        showProtected: true,
        games: ["ra", "cnc"],
        players: [0, 10],
        search: "",
        showPlaying: false,
        showWaiting: true,
        version: "release-20180307" // Doesn't matter, will change right after it fetch versions list and will be replaced be newest one
      }
    };
  }

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
        // -> Remove all NOTPLAYING games
        filtered = basicFiltered.filter(g => g.state === EGameState.PLAYING);
      } else if (!filters.showEmpty) {
        // Show Waiting Games
        // -> Get games with at least 1 client
        filtered = basicFiltered.filter(g => g.clients.length > 0);
        console.log(filtered);
      } else if (!filters.showWaiting) {
        // Show Empty Games
        // -> Get games with NO clients OR those who are Playing
        filtered = basicFiltered.filter(
          g => (g.clients.length === 0 && g.state === EGameState.NOTPLAYING) || g.state === EGameState.PLAYING
        );
      }
      filtered = filtered.filter(g => (filters.showPlaying ? true : g.state === EGameState.NOTPLAYING));
    }

    const found = filters.search.length < 3 ? filtered : filtered.filter(g => Fuzzy(searchWord, g.name.toLowerCase()));
    const pages = Math.ceil(parseInt((found.length / 10).toFixed(1)));
    console.log(pages);
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
        async () => {
          const games = await fetchGames();
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

  onFilterChange = <F extends keyof TFilter>(filter: F, newValue: TFilter[F]) => {
    const filters = {
      ...this.state.filters,
      [filter]: newValue
    };
    const filteredGames = this.filterGames(this.state.games, filters);
    this.setState({
      filters,
      ...filteredGames
    });
  };

  render() {
    const { props, state } = this;
    return (
      <Layout>
        <Filters
          {...this.state.filters}
          onFilterChange={this.onFilterChange}
          versions={this.state.versions}
          onRefresh={this.updateGames}
          isLoading={this.state.isLoading}
        />
        <Table
          dataSource={this.state.filteredGames}
          size={"small"}
          expandedRowRender={(record: TGame) => (
            <Row>
              <Col span={8}>
                <Map id={record.id.toString()} hash={record.map} clients={record.clients} />
              </Col>
              <Col span={16}>
                <ClientsInfo mod={record.mod} clients={record.clients} orientation={"horizontal"} />
              </Col>
            </Row>
          )}
          pagination={false}
          className={"games"}
        >
          <Table.Column
            title="Mod"
            dataIndex="mod"
            width={50}
            render={(text: any, record: TGame) => (
              <Tooltip
                getPopupContainer={target => target as HTMLElement}
                title={
                  <div>
                    <div>
                      <b>Version:</b> {record.version}
                    </div>
                    <div>
                      <b>Address:</b> {record.address}
                    </div>
                  </div>
                }
              >
                <div>
                  <img src={`icons/${record.mod}.png`} height={24} />
                </div>
              </Tooltip>
            )}
          />
          <Table.Column
            title="Name"
            sorter={(a: TGame, b: TGame) => {
              const aName = a.name.toLowerCase();
              const bName = b.name.toLowerCase();
              if (aName < bName) {
                return -1;
              }
              if (aName > bName) {
                return 1;
              }
              return 0;
            }}
            render={(text: any, record: TGame) => (
              <div>
                <div>
                  {record.protected ? (
                    <Tooltip title={"Game is password protected"} getPopupContainer={target => target as HTMLElement}>
                      <i className="fa fa-lock" />
                    </Tooltip>
                  ) : null}{" "}
                  <span style={{ color: record.state === 1 ? "inherit" : "green" }}>{record.name}</span>
                </div>
                <div>
                  <small>{undefined}</small>
                </div>
              </div>
            )}
          />
          <Table.Column
            title="Players"
            width={90}
            sorter={(a: TGame, b: TGame) => a.players - b.players}
            render={(text: any, record: TGame) => (
              <div>
                {record.players} / {record.maxplayers}
              </div>
            )}
          />
          <Table.Column width={100} render={(text: any, record: TGame) => <ClientLabel game={record} />} />
          <Table.Column
            width={100}
            render={(text: any, record: TGame) => (
              <div style={{ textAlign: "right" }}>
                {// Don't show Join button on running games, neither on full servers
                record.state === 1 && record.players !== record.maxplayers ? (
                  <Button type="ghost" href={`openra-ra-release-20180307://${record.address}`} size="small">
                    Join
                  </Button>
                ) : null}
              </div>
            )}
          />
        </Table>
      </Layout>
    );
  }
}

render(<App />, document.getElementById("app") as HTMLDivElement);
