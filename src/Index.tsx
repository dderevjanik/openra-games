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

type State = {
  games: TGame[];
  maps: TMap[];
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
      pagination: {
        current: 1,
        total: 1
      },
      filters: {
        locked: true,
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
    const filtered = versioned
      .filter(g => filters.games.includes(g.mod))
      .filter(g => g.players >= filters.players[0] && g.players <= filters.players[1])
      .filter(g => (filters.locked ? true : g.protected === false))
      .filter(g => (filters.showPlaying ? true : g.state === 1))
      .filter(g => (filters.showWaiting ? true : g.state === 2));
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
      games,
      ...filteredGames,
      versions: versions.known_versions,
      filters: updatedFilter
    });
  }

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
        <Filters {...this.state.filters} onFilterChange={this.onFilterChange} versions={this.state.versions} />
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
              <div>
                <img src={`icons/${record.mod}.png`} height={24} />
              </div>
            )}
          />
          <Table.Column
            title="Name"
            render={(text: any, record: TGame) => (
              <div>
                <div>
                  {record.protected ? (
                    <Tooltip title={"Game is password protected"}>
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
            width={80}
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
              <div>
                {// Don't show Join button on running games, neither on full servers
                record.state === 1 && record.players !== record.maxplayers ? (
                  <Button type="ghost" href={`openra-ra-release-20180307://${record.address}`}>
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
