# Eliza GigBot Client

This package provides GigBot integration for the Eliza AI agent, enabling task automation and token earning.

## Features

- Task automation and management
- Interaction handling with GigBot API
- Token earning through task completions
- Approval workflow via Discord (optional)

## Setup Guide

### Prerequisites

- A GigBot Developer Account with API access
- Node.js and pnpm installed
- Discord bot (if using approval workflow)

### Step 1: Configure Environment Variables

Create or edit `.env` file in your project root:

```bash
# GigBot API Credentials
GIGBOT_API_URL=https://www.gigbot.xyz/api  # Default API URL for GigBot

# Client Configuration
GIG_SEARCH_INTERVAL=3     # Interval for searching tasks (hours)
GIG_ACTION_INTERVAL=12    # Interval for performing actions (hours)
GIG_CLAIM_INTERVAL=24     # Interval for claiming tasks (hours)
GIG_CLAIM_PLATFORM=x      # Platform for claiming tasks ('x' or 'farcaster')
EVM_PRIVATE_KEY=0x...     # Private key for claiming rewards (must start with 0x)

```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GIGBOT_API_URL` | GigBot API endpoint | https://www.gigbot.xyz/api | No |
| `GIG_SEARCH_INTERVAL` | How often to search for new tasks (hours) | 3 | No |
| `GIG_ACTION_INTERVAL` | How often to perform task actions (hours) | 12 | No |
| `GIG_CLAIM_INTERVAL` | How often to claim completed tasks (hours) | 24 | No |
| `GIG_CLAIM_PLATFORM` | Platform to claim tasks from ('x' or 'farcaster') | x | No |
| `EVM_PRIVATE_KEY` | Ethereum private key for claiming rewards | - | Yes |

**Important Security Note**: 
- Keep your `EVM_PRIVATE_KEY` secure and never commit it to version control
- Use a dedicated wallet for the agent with limited funds
- Consider using environment variables or a secure secret management system

### Step 2: Initialize the Client

```typescript
import { GigBotClientInterface } from "@elizaos/gigbot";

const gigbotPlugin = {
    name: "gigbot",
    description: "GigBot client",
    clients: [GigBotClientInterface],
};

// Register with your Eliza runtime
runtime.registerPlugin(gigbotPlugin);
```

## Features

### Task Automation

The client can automatically complete tasks based on your agent's capabilities and GigBot's available tasks. Tasks can be:
- Simple tasks
- Complex workflows
- Token-earning opportunities

### Interactions

Handles:
- Task collection
- Task completion
- Reward claiming

### Testing

```bash
# Run tests
pnpm test

# Run with debug logging
DEBUG=eliza:* pnpm start
```

### Common Issues

#### API Failures
- Verify credentials in .env
- Check API configuration

## Security Notes

- Never commit .env or credential files
- Use environment variables for sensitive data
- Implement proper rate limiting
- Monitor API usage and costs

## Support

For issues or questions:
1. Check the Common Issues section
2. Review debug logs (enable with DEBUG=eliza:*)
3. Open an issue with:
   - Error messages
   - Configuration details
   - Steps to reproduce
