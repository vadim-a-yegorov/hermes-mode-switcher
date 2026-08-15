# hermes-mode-switcher

Mode selector for the Hermes desktop app.  

Adds `Auto`, `Deep Research` mode and `Computer` mode.

![](Auto_Research_Computer.png "Auto | Research | Computer")

## Install

1. Copy this repo's `mode-toggles` folder into `~/.hermes/desktop-plugins/`:

   ```
   mkdir -p ~/.hermes/desktop-plugins/mode-toggles
   cp plugin.js ~/.hermes/desktop-plugins/mode-toggles/
   ```

2. Add the two personalities to your `~/.hermes/config.yaml` under `agent.personalities`:

   - `research-deep` (from `personalities/research-deep.yaml`)
   - `computer` (from `personalities/computer.yaml`)

3. Create the four sub-agent profiles the `computer` personality dispatches to:

   ```
   mkdir -p ~/.hermes/profiles/{researcher,executor,operator,verifier}
   # copy config.yaml + SOUL.md from profiles/<name>/ into each
   ```

4. Reload desktop plugins: `Cmd+K` → "Reload desktop plugins".

## Usage

Pick a mode in the composer toolbar:

- **Auto** — normal chat
- **Research** — prepends `[DEEP RESEARCH]`, runs cited multi-step research on send
- **Computer** — prepends `[OK-COMPUTER]`, dispatches parallel multi-worker orchestration