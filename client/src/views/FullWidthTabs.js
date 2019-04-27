import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import VerfiedUser from '@material-ui/icons/VerifiedUser';
import Group from '@material-ui/icons/Group';
import Info from '@material-ui/icons/Info';
import WatchLater from '@material-ui/icons/WatchLater';
import TimestampIP from './TimestampIP';
import ProveOwenership from './ProveOwenership';
import HowItWorks from './HowItWorks';
import AboutUs from './AboutUs';


function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="How It Works" icon={<Info />} />
            <Tab label="Timestamp Intelectual Property" icon={<WatchLater />}/>
            <Tab label="Prove Ownership" icon={<VerfiedUser />} />
            <Tab label="About Us" icon={<Group />}/>
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}><HowItWorks/></TabContainer>
          <TabContainer dir={theme.direction}><TimestampIP/></TabContainer>
          <TabContainer dir={theme.direction}><ProveOwenership/></TabContainer>
          <TabContainer dir={theme.direction}><AboutUs/></TabContainer>

        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);