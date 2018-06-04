import * as React from "react";
import Icon from "antd/lib/icon";

const REFRESH_TIME = 30; // refresh games after 30 seconds
const PROGRESSBAR_WIDTH = 51;

type Props = {
  onRefresh: () => void;
  isLoading: boolean;
};

type State = {
  seconds: number;
};

export class RefreshButton extends React.PureComponent<Props, State> {
  interval: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }

  tick = (): void => {
    // Don't update timer while isLoading
    if (!this.props.isLoading) {
      const next = this.state.seconds + 1;
      if (next === REFRESH_TIME) {
        this.props.onRefresh();
        this.setState({
          seconds: 0
        });
      } else {
        this.setState({
          seconds: next
        });
      }
    }
  };

  onRefreshHit = (): void => {
    this.props.onRefresh();
    this.setState({
      seconds: 0
    });
  };

  async componentDidMount(): Promise<void> {
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  async componentWillUnmount(): Promise<void> {
    clearInterval(this.interval);
  }

  render() {
    const { props } = this;
    return (
      <div>
        <div>
          <a className="no-focus" href="#" onClick={this.onRefreshHit}>
            {props.isLoading ? <Icon type="loading" /> : null} Refresh
          </a>
        </div>
        <div
          style={{
            height: "1px",
            backgroundColor: "darkred",
            width: PROGRESSBAR_WIDTH / REFRESH_TIME * this.state.seconds
          }}
        />
      </div>
    );
  }
}
