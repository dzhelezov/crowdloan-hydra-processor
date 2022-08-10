# Crowdloan FireSquid Processor


## Prerequisites

* Node v14x
* Docker
* Make (use WSL on Windows)

## Quick start

```bash
# The dependencies setup relies on de-duplication, use `ci` to get everything right
npm ci

# Build the squid
make build

# Start the processor (will block the terminal)
make process

# Start the GraphQL server, listening on port 4000 by default
make serve
```

## Project structure

The squid uses `SubstrateBatchProcessor` introduced in the FireSquid release. It processes batches of `Crowdloan.Contributed` and `Crowdloan.MemoUpdated` events in a single handler. The whole sync process should take less than 5 minutes.

## Misc

For more details, please check out https://docs.subsquid.io.