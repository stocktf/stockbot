Stockbot
===

Worker bot for Stock.tf

## Jobs (unstable)

Bots will look for new jobs in a Redis list called `game`:qu. Where `game` is specified in the config under `qu.game.appID`. Below is an example of a job.
``` json
  {
    "client": 236778367682456,
    "type": "give",
    "amount": 3
  }

```

- `client`: This should be the client's steamID
- `type`: The type of job to be carried out, it can either be `give` or `receive`
- `amount`: The amount to either give or expect to receive