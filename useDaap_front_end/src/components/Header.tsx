import { useEthers } from "@usedapp/core";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

export const Header = () => {
  const classes = useStyles();
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const isConnected: boolean = account !== undefined;

  return (
    <div className={classes.root}>
      {
        isConnected ?
        <Button variant="contained" color="secondary" onClick={deactivate}>Disconnect</Button>
        : <Button variant="contained"color="primary" onClick={activateBrowserWallet}>Connect</Button>
      }
    </div>
  )
}